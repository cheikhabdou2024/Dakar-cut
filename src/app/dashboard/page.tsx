
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Calendar, Clock, Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { appointments as initialAppointments, type Appointment } from "@/lib/placeholder-data";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, subDays, parseISO, getDay } from 'date-fns';

const APPOINTMENTS_STORAGE_KEY = 'dakar-hair-connect-appointments';

const chartConfig = {
  revenue: {
    label: "Revenue (FCFA)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const getStartOfWeek = (date: Date) => {
    return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
    const [kpis, setKpis] = useState([
        { title: "Today's Revenue", value: "...", icon: DollarSign, change: "Loading..." },
        { title: "Today's Bookings", value: "...", icon: Calendar, change: "Loading..." },
        { title: "Occupancy Rate", value: "78%", icon: Users, change: "+3% from last week" }, // Still static
        { title: "Avg. Service Time", value: "...", icon: Clock, change: "Loading..." },
    ]);
    const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);

    useEffect(() => {
        try {
            const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            const loadedAppointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : initialAppointments;

            const today = new Date();
            
            // 1. Process KPIs
            const todaysAppointments = loadedAppointments.filter((a) => isSameDay(parseISO(a.date), today) && a.status !== 'Cancelled');
            const todaysCompletedAppointments = todaysAppointments.filter((a) => a.status === 'Completed');
            const todaysRevenue = todaysCompletedAppointments.reduce((sum, a) => sum + a.cost, 0);

            const allCompletedAppointments = loadedAppointments.filter(a => a.status === 'Completed');
            const totalServiceMinutes = allCompletedAppointments.reduce((sum, a) => sum + a.duration, 0);
            const avgServiceTime = allCompletedAppointments.length > 0 
                ? Math.round(totalServiceMinutes / allCompletedAppointments.length) 
                : 0;

            setKpis(prevKpis => [
                { ...prevKpis[0], value: `${todaysRevenue.toLocaleString()} FCFA`, change: `from ${todaysCompletedAppointments.length} completed bookings` },
                { ...prevKpis[1], value: todaysAppointments.length.toString(), change: `total for today` },
                prevKpis[2], // Occupancy Rate remains static
                { ...prevKpis[3], value: `${avgServiceTime} min`, change: `avg. over ${allCompletedAppointments.length} services` },
            ]);

            // 2. Process Weekly Revenue Chart
            const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
            const weeklyChartData = last7Days.map(day => {
                const dayRevenue = loadedAppointments
                    .filter((a) => a.status === 'Completed' && isSameDay(parseISO(a.date), day))
                    .reduce((sum, a) => sum + a.cost, 0);
                return {
                    day: format(day, 'E'),
                    revenue: dayRevenue,
                };
            });
            setChartData(weeklyChartData);

            // 3. Process This Week's Schedule
            const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"];
            
            const newSchedule: Record<string, Record<string, string>> = {};
            timeSlots.forEach(time => {
                newSchedule[time] = {};
                weekDays.forEach(day => newSchedule[time][day] = "");
            });
            
            const startOfThisWeek = getStartOfWeek(today);
            const appointmentsThisWeek = loadedAppointments.filter(a => {
                const apptDate = parseISO(a.date);
                return apptDate >= startOfThisWeek && apptDate <= endOfWeek(startOfThisWeek, { weekStartsOn: 1 });
            });

            appointmentsThisWeek.forEach((appt) => {
                const apptDate = parseISO(appt.date);
                const dayIndex = (getDay(apptDate) + 6) % 7; 
                const dayName = weekDays[dayIndex];
                
                const apptHour = parseInt(appt.time.split(':')[0]);
                const closestSlot = timeSlots.find(slot => parseInt(slot.split(':')[0]) === apptHour);

                if (dayName && closestSlot && !newSchedule[closestSlot][dayName]) {
                    newSchedule[closestSlot][dayName] = `Booked`;
                }
            });
            setSchedule(newSchedule);

        } catch (error) {
            console.error("Failed to process dashboard data from localStorage", error);
        }
        setIsLoading(false);
    }, []);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
            <h1 className="font-headline text-4xl font-bold text-primary">Stylist Dashboard</h1>
            <p className="text-muted-foreground">Your business at a glance.</p>
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
                <CardTitle className="font-headline text-3xl text-primary">Weekly Revenue</CardTitle>
                <CardDescription>Revenue overview for the last 7 days.</CardDescription>
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
                This Week's Schedule
                </h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Time</TableHead>
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
