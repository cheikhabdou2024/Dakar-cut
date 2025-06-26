import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Calendar, Clock } from "lucide-react";

export default function DashboardPage() {
  const kpis = [
    { title: "Today's Revenue", value: "85,000 FCFA", icon: DollarSign, change: "+12%" },
    { title: "Today's Bookings", value: "17", icon: Calendar, change: "+5" },
    { title: "Occupancy Rate", value: "78%", icon: Users, change: "+3%" },
    { title: "Avg. Service Time", value: "45 min", icon: Clock, change: "-2 min" },
  ];

  const schedule = {
    "09:00": { Monday: "Awa Fall", Tuesday: "", Wednesday: "Cheikh B.", Thursday: "", Friday: "Fatou Diop", Saturday: "Full" },
    "10:00": { Monday: "", Tuesday: "M. Gueye", Wednesday: "", Thursday: "Sophie G.", Friday: "Fatou Diop", Saturday: "Full" },
    "11:00": { Monday: "Khadija", Tuesday: "M. Gueye", Wednesday: "Ibrahim", Thursday: "", Friday: "", Saturday: "Full" },
    "12:00": { Monday: "", Tuesday: "", Wednesday: "Ibrahim", Thursday: "Sophie G.", Friday: "Break", Saturday: "Full" },
    "14:00": { Monday: "Khadija", Tuesday: "Awa Fall", Wednesday: "Cheikh B.", Thursday: "Ndeye", Friday: "", Saturday: "Full" },
    "15:00": { Monday: "", Tuesday: "", Wednesday: "", Thursday: "Ndeye", Friday: "Mariama Ba", Saturday: "Full" },
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
              <p className="text-xs text-muted-foreground">{kpi.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                                        <div className={`p-2 rounded-md text-xs text-center ${bookings[day as keyof typeof bookings] === "Full" ? 'bg-red-100 text-red-800' : bookings[day as keyof typeof bookings] === "Break" ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
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
  );
}
