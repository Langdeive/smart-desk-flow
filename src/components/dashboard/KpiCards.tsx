
import { KpiCard } from "./KpiCard";
import { Clock, CheckCircle, TicketCheck, Bot } from "lucide-react";

export function KpiCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Tickets"
        value="127"
        description="Todos os chamados ativos"
        icon={<TicketCheck className="h-5 w-5" />}
        href="/tickets"
        ariaLabel="Ver todos os tickets"
        className="kpi-card-primary"
      />
      
      <KpiCard
        title="Taxa de Resolução"
        value="87%"
        description="Chamados resolvidos"
        icon={<CheckCircle className="h-5 w-5" />}
        href="/tickets?status=resolved"
        ariaLabel="Ver tickets resolvidos"
        className="kpi-card-secondary"
      />
      
      <KpiCard
        title="Tempo Médio de Resposta"
        value="1.8h"
        description="Primeira resposta"
        icon={<Clock className="h-5 w-5" />}
        href="/tickets?sort=firstResponseTime"
        ariaLabel="Ver tickets ordenados por tempo de resposta"
        className="kpi-card-accent"
      />
      
      <KpiCard
        title="Resolvidos por IA"
        value="43"
        description="Sem intervenção humana"
        icon={<Bot className="h-5 w-5" />}
        href="/tickets?ai_handled=true"
        ariaLabel="Ver tickets resolvidos por IA"
        className="kpi-card-ai"
      />
    </div>
  );
}
