
import { KpiCard } from "./KpiCard";
import { Clock, CheckCircle, TicketCheck, Bot } from "lucide-react";
import { useHelenaArticles } from "@/hooks/useHelenaArticles";
import { useDashboardData } from "@/hooks/useDashboardData";

export function KpiCards() {
  const { helenaStats } = useHelenaArticles();
  const { kpis, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total de Tickets"
        value={kpis?.totalTickets.current || 0}
        description={`${kpis?.totalTickets.percentageChange >= 0 ? '+' : ''}${kpis?.totalTickets.percentageChange.toFixed(1)}% vs mês anterior`}
        icon={<TicketCheck className="h-5 w-5" />}
        href="/tickets"
        ariaLabel="Ver todos os tickets"
        className="kpi-card-primary"
      />
      
      <KpiCard
        title="Taxa de Resolução"
        value={`${kpis?.resolutionRate.current || 0}%`}
        description={`${kpis?.resolutionRate.percentageChange >= 0 ? '+' : ''}${kpis?.resolutionRate.percentageChange.toFixed(1)}% vs mês anterior`}
        icon={<CheckCircle className="h-5 w-5" />}
        href="/tickets?status=resolved"
        ariaLabel="Ver tickets resolvidos"
        className="kpi-card-secondary"
      />
      
      <KpiCard
        title="Tempo Médio de Resposta"
        value={kpis?.avgResponseTime.formatted || "0h"}
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
