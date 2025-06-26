
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Calendar, Clock, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { appointments as initialAppointments, type Appointment } from "@/lib/placeholder-data";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, subDays, parseISO, getDay, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

const APPOINTMENTS_STORAGE_KEY = 'dakar-hair-connect-appointments';

const chartConfig = {
  revenue: {
    label: "Revenus (FCFA)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const getStartOfWeek = (date: Date) => {
    return startOfWeek(date, { weekStartsOn: 1 }); // Lundi
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
    const [kpis, setKpis] = useState([
        { title: "Revenus d'Aujourd'hui", value: "...", icon: DollarSign, change: "Chargement..." },
        { title: "Réservations d'Aujourd'hui", value: "...", icon: Calendar, change: "Chargement..." },
        { title: "Taux d'Occupation Hebdomadaire", value: "...", icon: Users, change: "Chargement..." },
        { title: "Temps de Service Moyen", value: "...", icon: Clock, change: "Chargement..." },
    ]);
    const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);

    useEffect(() => {
        try {
            const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            const loadedAppointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : initialAppointments;

            const today = new Date();
            
            // --- KPI Calculations ---
            const todaysAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), today) && a.status !== 'Annulé');
            const todaysCompletedAppointments = todaysAppointments.filter((a) => a.status === 'Terminé');
            const todaysRevenue = todaysCompletedAppointments.reduce((sum, a) => sum + a.cost, 0);

            const allCompletedAppointments = loadedAppointments.filter(a => a.status === 'Terminé');
            const totalServiceMinutes = allCompletedAppointments.reduce((sum, a) => sum + a.duration, 0);
            const avgServiceTime = allCompletedAppointments.length > 0 
                ? Math.round(totalServiceMinutes / allCompletedAppointments.length) 
                : 0;
            
            // Occupancy Rate Calculation
            const startOfThisWeek = getStartOfWeek(today);
            const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
            const startOfLastWeek = subWeeks(startOfThisWeek, 1);
            const endOfLastWeek = subWeeks(endOfThisWeek, 1);
            
            const totalAvailableMinutesPerWeek = 6 * 6 * 60; // 6 jours/semaine, 6 heures/jour (9-12, 14-17)

            const appointmentsThisWeek = loadedAppointments.filter(a => {
                const apptDate = parseISO(a.date);
                return a.status !== 'Annulé' && apptDate >= startOfThisWeek && apptDate <= endOfThisWeek;
            });
            const bookedMinutesThisWeek = appointmentsThisWeek.reduce((sum, a) => sum + a.duration, 0);
            const occupancyThisWeek = totalAvailableMinutesPerWeek > 0 ? (bookedMinutesThisWeek / totalAvailableMinutesPerWeek) * 100 : 0;

            const appointmentsLastWeek = loadedAppointments.filter(a => {
                const apptDate = parseISO(a.date);
                return a.status !== 'Annulé' && apptDate >= startOfLastWeek && apptDate <= endOfLastWeek;
            });
            const bookedMinutesLastWeek = appointmentsLastWeek.reduce((sum, a) => sum + a.duration, 0);
            const occupancyLastWeek = totalAvailableMinutesPerWeek > 0 ? (bookedMinutesLastWeek / totalAvailableMinutesPerWeek) * 100 : 0;
            const occupancyChange = occupancyThisWeek - occupancyLastWeek;
            const occupancyChangeText = occupancyLastWeek === 0 && occupancyThisWeek > 0 
                ? 'En hausse par rapport à 0% la semaine dernière' 
                : (occupancyChange === 0 ? "pas de changement" : `${occupancyChange > 0 ? '+' : ''}${occupancyChange.toFixed(0)}% par rapport à la semaine dernière`);

            setKpis([
                { title: "Revenus d'Aujourd'hui", value: `${todaysRevenue.toLocaleString('fr-FR')} FCFA`, icon: DollarSign, change: `sur ${todaysCompletedAppointments.length} réservations terminées` },
                { title: "Réservations d'Aujourd'hui", value: todaysAppointments.length.toString(), icon: Calendar, change: `total pour aujourd'hui` },
                { title: "Taux d'Occupation Hebdomadaire", value: `${occupancyThisWeek.toFixed(0)}%`, icon: Users, change: occupancyChangeText },
                { title: "Temps de Service Moyen", value: `${avgServiceTime} min`, icon: Clock, change: `moy. sur ${allCompletedAppointments.length} services` },
            ]);

            // --- Weekly Revenue Chart ---
            const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
            const weeklyChartData = last7Days.map(day => {
                const dayRevenue = loadedAppointments
                    .filter((a) => a.status === 'Terminé' && isSameDay(parseISO(a.date), day))
                    .reduce((sum, a) => sum + a.cost, 0);
                return { day: format(day, 'EEEEEE', { locale: fr }), revenue: dayRevenue };
            });
            setChartData(weeklyChartData);

            // --- This Week's Schedule ---
            const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];
            
            const newSchedule: Record<string, Record<string, string>> = {};
            timeSlots.forEach(time => {
                newSchedule[time] = {};
                weekDays.forEach(day => newSchedule[time][day] = "");
            });
            
            // Use `appointmentsThisWeek` which is already filtered for the correct date range and status
            appointmentsThisWeek.forEach((appt) => {
                const apptDate = parseISO(appt.date);
                const dayIndex = (getDay(apptDate) + 6) % 7; 
                const dayName = weekDays[dayIndex];
                
                const apptHour = parseInt(appt.time.split(':')[0]);
                const closestSlot = timeSlots.find(slot => parseInt(slot.split(':')[0]) === apptHour);

                if (dayName && closestSlot && !newSchedule[closestSlot][dayName]) {
                    newSchedule[closestSlot][dayName] = appt.serviceNames.join(', ');
                }
            });
            setSchedule(newSchedule);

        } catch (error) {
            console.error("Failed to process dashboard data from localStorage", error);
        }
        setIsLoading(false);
    }, []);

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    if (isLoading) {
        return (
          <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
            <h1 className="font-headline text-4xl font-bold text-primary">Tableau de Bord Styliste</h1>
            <p className="text-muted-foreground">Votre activité en un coup d'œil.</p>
        </header>

        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
            <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
                </CardContent>
            </Card>
            ))}
        </div>
        
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Revenus Hebdomadaires</CardTitle>
                <CardDescription>Aperçu des revenus des 7 derniers jours.</CardDescription>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tickFormatter={(value) => `${Number(value) / 1000}k`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                    </BarChart>
                </ChartContainer>
                </CardContent>
            </Card>

            <div>
                <h2 className="font-headline text-3xl font-semibold mb-6 text-primary">
                Planning de la Semaine
                </h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Heure</TableHead>
                                {days.map(day => <TableHead key={day}>{day}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(schedule).map(([time, bookings]) => (
                                <TableRow key={time}>
                                    <TableCell className="font-medium">{time}</TableCell>
                                    {days.map(day => (
                                        <TableCell key={day}>
                                            {bookings[day as keyof typeof bookings] && (
                                                <div className={`p-2 rounded-md text-xs text-center bg-primary/10 text-primary-90`}>
                                                    {bookings[day as keyof typeof bookings]}
                                                </div>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
        </div>
    );
}
