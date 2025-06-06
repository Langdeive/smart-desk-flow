
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types";
import { TicketCheck, UserCheck, Bot } from "lucide-react";

interface TicketStatsProps {
  tickets: Ticket[];
}

const TicketStats: React.FC<TicketStatsProps> = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="modern-card bg-gradient-to-br from-white to-cyan-50 border-cyan-200/50 hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TicketCheck className="h-5 w-5 text-cyan-600" />
            <CardTitle className="text-cyan-900">Total de Tickets</CardTitle>
          </div>
          <CardDescription>Todos os chamados ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-cyan-700">{tickets.length}</p>
        </CardContent>
      </Card>
      
      <Card className="modern-card bg-gradient-to-br from-white to-orange-50 border-orange-200/50 hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900">Aguardando Review</CardTitle>
          </div>
          <CardDescription>Tickets que precisam de análise</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-700">
            {tickets.filter(t => t.needsHumanReview).length}
          </p>
        </CardContent>
      </Card>
      
      <Card className="modern-card bg-gradient-to-br from-white to-purple-50 border-purple-200/50 hover:shadow-lg transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">Respondidos Automaticamente</CardTitle>
          </div>
          <CardDescription>Resolvidos pela IA</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-700">
            {tickets.filter(t => t.aiProcessed && !t.needsHumanReview).length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketStats;
