
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PenBox, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { Ticket, TicketStatus } from "@/types";

interface TicketHeaderProps {
  ticket: Ticket;
  statusColors: Record<TicketStatus, string>;
  statusLabels: Record<TicketStatus, string>;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  ticket, 
  statusColors, 
  statusLabels 
}) => {
  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link to="/tickets">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Tickets
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            #{ticket.id}{" "}
            <Badge
              variant="outline"
              className={`${statusColors[ticket.status]} text-white`}
            >
              {statusLabels[ticket.status]}
            </Badge>
          </h1>
          <p className="text-lg font-medium">{ticket.title}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <PenBox className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
