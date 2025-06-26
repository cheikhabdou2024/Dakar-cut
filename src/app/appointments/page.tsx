import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointments } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Scissors, Tag, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const pastAppointments = appointments.filter(a => a.status !== 'Upcoming');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">My Appointments</h1>
        <p className="text-muted-foreground">Manage your past and future bookings.</p>
      </header>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">History</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <Card key={appt.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-primary">{appt.salonName}</CardTitle>
                    <Badge variant={appt.status === 'Upcoming' ? 'default' : 'secondary'} className="w-fit">
                      {getStatusIcon(appt.status)}
                      <span className="ml-2">{appt.status}</span>
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-sm"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="flex items-center text-sm"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.time}</div>
                    <div className="flex items-start text-sm"><Scissors className="mr-2 h-4 w-4 text-muted-foreground mt-1" /> <div>{appt.serviceNames.join(', ')}</div></div>
                    <div className="flex items-center text-sm"><Tag className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.cost} FCFA</div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline">Modify</Button>
                    <Button variant="destructive">Cancel</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>You have no upcoming appointments.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
             {pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => (
                <Card key={appt.id} className="flex flex-col opacity-80">
                  <CardHeader>
                    <CardTitle className="font-headline">{appt.salonName}</CardTitle>
                    <Badge variant="secondary" className="w-fit flex items-center">
                      {getStatusIcon(appt.status)}
                      <span className="ml-2">{appt.status}</span>
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-sm"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> {new Date(appt.date).toLocaleDateString()}</div>
                    <div className="flex items-center text-sm"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> {appt.time}</div>
                    <div className="flex items-start text-sm"><Scissors className="mr-2 h-4 w-4 text-muted-foreground mt-1" /> <div>{appt.serviceNames.join(', ')}</div></div>
                  </CardContent>
                  <CardFooter>
                    {appt.status === 'Completed' && <Button>Book Again</Button>}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>You have no past appointments.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
