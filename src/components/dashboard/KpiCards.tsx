
import { KpiCard } from "./KpiCard";
import { Clock, CheckCircle, TicketCheck, Bot } from "lucide-react";
import { useHelenaArticles } from "@/hooks/useHelenaArticles";

export function KpiCards() {
  const { helenaStats } = useHelenaArticles();

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
        title="Helena - Artigos Pendentes"
        value={helenaStats?.total_pending || 0}
        description="Aguardando aprovação"
        icon={<Bot className="h-5 w-5" />}
        href="/helena"
        ariaLabel="Ver artigos pendentes da Helena"
        className="kpi-card-ai"
      />
    </div>
  );
}
