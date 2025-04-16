
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types";

interface TicketStatsProps {
  tickets: Ticket[];
}

const TicketStats: React.FC<TicketStatsProps> = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total de Tickets</CardTitle>
          <CardDescription>Todos os chamados ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{tickets.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Aguardando Review</CardTitle>
          <CardDescription>Tickets que precisam de análise</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {tickets.filter(t => t.needsHumanReview).length}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Respondidos Automaticamente</CardTitle>
          <CardDescription>Resolvidos pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {tickets.filter(t => t.aiProcessed && !t.needsHumanReview).length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketStats;
