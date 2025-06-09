
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
        className="modern-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderColor: 'rgba(6, 182, 212, 0.2)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}
      />
      
      <KpiCard
        title="Taxa de Resolução"
        value="87%"
        description="Chamados resolvidos"
        icon={<CheckCircle className="h-5 w-5" />}
        href="/tickets?status=resolved"
        ariaLabel="Ver tickets resolvidos"
        className="modern-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(30, 58, 138, 0.05) 100%)',
          borderColor: 'rgba(30, 58, 138, 0.2)',
          border: '1px solid rgba(30, 58, 138, 0.2)'
        }}
      />
      
      <KpiCard
        title="Tempo Médio de Resposta"
        value="1.8h"
        description="Primeira resposta"
        icon={<Clock className="h-5 w-5" />}
        href="/tickets?sort=firstResponseTime"
        ariaLabel="Ver tickets ordenados por tempo de resposta"
        className="modern-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(124, 58, 237, 0.05) 100%)',
          borderColor: 'rgba(124, 58, 237, 0.2)',
          border: '1px solid rgba(124, 58, 237, 0.2)'
        }}
      />
      
      <KpiCard
        title="Resolvidos por IA"
        value="43"
        description="Sem intervenção humana"
        icon={<Bot className="h-5 w-5" />}
        href="/tickets?ai_handled=true"
        ariaLabel="Ver tickets resolvidos por IA"
        className="modern-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderColor: 'rgba(6, 182, 212, 0.2)',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}
      />
    </div>
  );
}
