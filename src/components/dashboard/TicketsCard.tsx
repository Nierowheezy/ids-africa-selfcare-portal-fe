import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

interface TicketsCardProps {
  openTickets: number;
}

export function TicketsCard({ openTickets }: TicketsCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-gray-700">Your Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {openTickets === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Ticket className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600">You have no open tickets</p>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Ticket className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{openTickets}</p>
              <p className="text-sm text-gray-600">Open tickets</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
