
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types";
import { statusColors, statusLabels, formatDate, priorityLabels } from "./TicketUtils";

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, loading }) => {
  const navigate = useNavigate();

  const handleViewTicket = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <div className="rounded-md border-turquoise-vibrant border-2 force-white-table">
      <Table className="force-white-table border-turquoise-vibrant">
        <TableHeader className="bg-gray-50 border-b-2 border-turquoise-vibrant">
          <TableRow className="border-b border-turquoise-vibrant">
            <TableHead className="border-turquoise-vibrant">ID</TableHead>
            <TableHead className="border-turquoise-vibrant">Título</TableHead>
            <TableHead className="border-turquoise-vibrant">Status</TableHead>
            <TableHead className="border-turquoise-vibrant">Prioridade</TableHead>
            <TableHead className="border-turquoise-vibrant">Criado em</TableHead>
            <TableHead className="border-turquoise-vibrant">Fonte</TableHead>
            <TableHead className="border-turquoise-vibrant">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-b border-gray-200 hover:bg-cyan-50 hover:border-turquoise-vibrant">
              <TableCell colSpan={7} className="text-center py-8">
                Carregando tickets...
              </TableCell>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow className="border-b border-gray-200 hover:bg-cyan-50 hover:border-turquoise-vibrant">
              <TableCell colSpan={7} className="text-center py-8">
                Nenhum ticket encontrado
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-b border-gray-200 hover:bg-cyan-50 hover:border-turquoise-vibrant transition-all duration-200">
                <TableCell className="font-medium">#{ticket.id.substring(0, 8)}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusColors[ticket.status]} text-white`}
                  >
                    {statusLabels[ticket.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    ticket.priority === "high" || ticket.priority === "critical" 
                      ? "border-red-500 text-red-500" 
                      : ticket.priority === "medium" 
                        ? "border-orange-500 text-orange-500" 
                        : "border-blue-500 text-blue-500"
                  }>
                    {priorityLabels[ticket.priority]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {ticket.source.charAt(0).toUpperCase() + ticket.source.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewTicket(ticket.id)}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketList;
