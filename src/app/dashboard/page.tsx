
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Calendar, Clock, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { appointments as initialAppointments, type Appointment } from "@/lib/placeholder-data";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, subDays, parseISO, getDay, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

const ChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
    const [kpis, setKpis] = useState([
        { title: "Revenus d'Aujourd'hui", value: "...", icon: DollarSign, change: "Chargement...", changeValue: 0 },
        { title: "Réservations d'Aujourd'hui", value: "...", icon: Calendar, change: "Chargement...", changeValue: 0 },
        { title: "Taux d'Occupation Hebdo", value: "...", icon: Users, change: "Chargement...", changeValue: 0 },
        { title: "Temps de Service Moyen", value: "...", icon: Clock, change: "Chargement...", changeValue: 0 },
    ]);
    const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);
    const [popularServices, setPopularServices] = useState<{ name: string; count: number }[]>([]);

    useEffect(() => {
        try {
            const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            const loadedAppointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : initialAppointments;

            const today = new Date();
            const yesterday = subDays(today, 1);
            
            // --- Comparative KPI Calculations ---
            const formatPercentageChange = (current: number, previous: number) => {
                if (previous === 0) {
                    return current > 0 ? `En hausse par rapport à 0` : `Aucun changement`;
                }
                const percentage = ((current - previous) / previous) * 100;
                if (Math.abs(percentage) < 0.1) return `Aucun changement`;
                return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}% par rapport à hier`;
            };
            
            const formatAbsoluteChange = (current: number, previous: number, unit: string, period: string) => {
                 const change = current - previous;
                 if (change === 0) return `Aucun changement par rapport à ${period}`;
                 return `${change > 0 ? '+' : ''}${change.toFixed(0)}${unit} par rapport à ${period}`;
            }

            // 1. Daily Revenue
            const todaysCompletedAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), today) && a.status === 'Terminé');
            const todaysRevenue = todaysCompletedAppointments.reduce((sum, a) => sum + a.cost, 0);
            const yesterdaysCompletedAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), yesterday) && a.status === 'Terminé');
            const yesterdaysRevenue = yesterdaysCompletedAppointments.reduce((sum, a) => sum + a.cost, 0);
            const revenueChange = todaysRevenue - yesterdaysRevenue;
            const revenueChangeText = formatPercentageChange(todaysRevenue, yesterdaysRevenue);

            // 2. Daily Bookings
            const todaysAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), today) && a.status !== 'Annulé');
            const yesterdaysAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), yesterday) && a.status !== 'Annulé');
            const bookingsChange = todaysAppointments.length - yesterdaysAppointments.length;
            const bookingsChangeText = formatAbsoluteChange(todaysAppointments.length, yesterdaysAppointments.length, '', 'hier');

            // 3. Weekly Occupancy & Service Time
            const startOfThisWeek = getStartOfWeek(today);
            const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
            const startOfLastWeek = subWeeks(startOfThisWeek, 1);
            const endOfLastWeek = subWeeks(endOfThisWeek, 1);

            const appointmentsThisWeek = loadedAppointments.filter(a => {
                const apptDate = parseISO(a.date);
                return a.status !== 'Annulé' && apptDate >= startOfThisWeek && apptDate <= endOfThisWeek;
            });
            const appointmentsLastWeek = loadedAppointments.filter(a => {
                const apptDate = parseISO(a.date);
                return a.status !== 'Annulé' && apptDate >= startOfLastWeek && apptDate <= endOfLastWeek;
            });

            // Occupancy Rate
            const totalAvailableMinutesPerWeek = 6 * 6 * 60; // 6 jours/semaine, 6 heures/jour (9-12, 14-17)
            const bookedMinutesThisWeek = appointmentsThisWeek.reduce((sum, a) => sum + a.duration, 0);
            const occupancyThisWeek = totalAvailableMinutesPerWeek > 0 ? (bookedMinutesThisWeek / totalAvailableMinutesPerWeek) * 100 : 0;
            const bookedMinutesLastWeek = appointmentsLastWeek.reduce((sum, a) => sum + a.duration, 0);
            const occupancyLastWeek = totalAvailableMinutesPerWeek > 0 ? (bookedMinutesLastWeek / totalAvailableMinutesPerWeek) * 100 : 0;
            const occupancyChange = occupancyThisWeek - occupancyLastWeek;
            const occupancyChangeText = formatAbsoluteChange(occupancyThisWeek, occupancyLastWeek, '%', 'la semaine dernière');
            
            // Average Service Time
            const completedThisWeek = appointmentsThisWeek.filter(a => a.status === 'Terminé');
            const totalMinutesThisWeek = completedThisWeek.reduce((sum, a) => sum + a.duration, 0);
            const avgTimeThisWeek = completedThisWeek.length > 0 ? Math.round(totalMinutesThisWeek / completedThisWeek.length) : 0;
            
            const completedLastWeek = appointmentsLastWeek.filter(a => a.status === 'Terminé');
            const totalMinutesLastWeek = completedLastWeek.reduce((sum, a) => sum + a.duration, 0);
            const avgTimeLastWeek = completedLastWeek.length > 0 ? Math.round(totalMinutesLastWeek / completedLastWeek.length) : 0;
            const avgTimeChange = avgTimeThisWeek - avgTimeLastWeek;
            const avgTimeChangeText = formatAbsoluteChange(avgTimeThisWeek, avgTimeLastWeek, ' min', 'la semaine dernière');

            setKpis([
                { title: "Revenus d'Aujourd'hui", value: `${todaysRevenue.toLocaleString('fr-FR')} FCFA`, icon: DollarSign, change: revenueChangeText, changeValue: revenueChange },
                { title: "Réservations d'Aujourd'hui", value: todaysAppointments.length.toString(), icon: Calendar, change: bookingsChangeText, changeValue: bookingsChange },
                { title: "Taux d'Occupation Hebdo", value: `${occupancyThisWeek.toFixed(0)}%`, icon: Users, change: occupancyChangeText, changeValue: occupancyChange },
                { title: "Temps de Service Moyen", value: `${avgTimeThisWeek} min`, icon: Clock, change: avgTimeChangeText, changeValue: avgTimeChange },
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

            // --- Popular Services ---
            const allCompletedAppointments = loadedAppointments.filter(a => a.status === 'Terminé');
            const serviceCounts: Record<string, number> = {};
            allCompletedAppointments.forEach(appt => {
              appt.serviceNames.forEach(serviceName => {
                serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
              });
            });
            const sortedServices = Object.entries(serviceCounts)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);
            setPopularServices(sortedServices);

            // --- This Week's Schedule ---
            const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];
            
            const newSchedule: Record<string, Record<string, string>> = {};
            timeSlots.forEach(time => {
                newSchedule[time] = {};
                weekDays.forEach(day => newSchedule[time][day] = "");
            });
            
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
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ChangeIndicator change={kpi.changeValue} />
                    <span>{kpi.change}</span>
                </p>
                </CardContent>
            </Card>
            ))}
        </div>
        
        <div className="grid gap-8">
            <div className="grid gap-8 md:grid-cols-2">
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
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2"><TrendingUp />Services Populaires</CardTitle>
                        <CardDescription>Les services les plus réservés.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {popularServices.length > 0 ? (
                        <ul className="space-y-4">
                            {popularServices.map((service) => (
                            <li key={service.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-sm">{service.name}</p>
                                    <span className="font-bold text-sm text-primary">{service.count} fois</span>
                                </div>
                                <Progress value={(service.count / popularServices[0].count) * 100} className="h-2" />
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-muted-foreground text-center py-10">Pas assez de données pour afficher les services populaires.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

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

