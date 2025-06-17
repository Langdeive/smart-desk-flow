
import { supabase } from '@/integrations/supabase/client';
import { DashboardKPIs, ChartData } from '@/hooks/useDashboardData';

export async function getDashboardKPIs(companyId: string): Promise<DashboardKPIs> {
  if (!companyId) {
    throw new Error('Company ID is required');
  }

  // Get current month and previous month dates
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Total Tickets
  const { data: currentTickets } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .gte('created_at', currentMonthStart.toISOString());

  const { data: previousTickets } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .gte('created_at', previousMonthStart.toISOString())
    .lt('created_at', previousMonthEnd.toISOString());

  const totalCurrent = currentTickets?.length || 0;
  const totalPrevious = previousTickets?.length || 0;
  const totalChange = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;

  // Resolution Rate
  const { data: resolvedCurrent } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('status', 'resolved')
    .gte('created_at', currentMonthStart.toISOString());

  const { data: resolvedPrevious } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('status', 'resolved')
    .gte('created_at', previousMonthStart.toISOString())
    .lt('created_at', previousMonthEnd.toISOString());

  const resolutionCurrent = totalCurrent > 0 ? (resolvedCurrent?.length || 0) / totalCurrent * 100 : 0;
  const resolutionPrevious = totalPrevious > 0 ? (resolvedPrevious?.length || 0) / totalPrevious * 100 : 0;
  const resolutionChange = resolutionPrevious > 0 ? ((resolutionCurrent - resolutionPrevious) / resolutionPrevious) * 100 : 0;

  // Average Response Time (simplified calculation)
  const { data: responseTimeData } = await supabase
    .from('tickets')
    .select('created_at, updated_at')
    .eq('company_id', companyId)
    .gte('created_at', currentMonthStart.toISOString())
    .not('updated_at', 'is', null);

  let avgResponseHours = 0;
  if (responseTimeData && responseTimeData.length > 0) {
    const totalResponseTime = responseTimeData.reduce((acc, ticket) => {
      const created = new Date(ticket.created_at);
      const updated = new Date(ticket.updated_at);
      return acc + (updated.getTime() - created.getTime());
    }, 0);
    avgResponseHours = totalResponseTime / (responseTimeData.length * 1000 * 60 * 60); // Convert to hours
  }

  // AI Resolved Tickets
  const { data: aiResolvedData } = await supabase
    .from('tickets')
    .select('id', { count: 'exact' })
    .eq('company_id', companyId)
    .eq('ai_processed', true)
    .eq('needs_human_review', false)
    .gte('created_at', currentMonthStart.toISOString());

  const aiResolvedCount = aiResolvedData?.length || 0;
  const aiResolvedPercentage = totalCurrent > 0 ? (aiResolvedCount / totalCurrent) * 100 : 0;

  return {
    totalTickets: {
      current: totalCurrent,
      previousMonth: totalPrevious,
      percentageChange: totalChange,
    },
    resolutionRate: {
      current: Math.round(resolutionCurrent),
      previousMonth: Math.round(resolutionPrevious),
      percentageChange: resolutionChange,
    },
    avgResponseTime: {
      current: avgResponseHours,
      previousMonth: 0, // Simplified for now
      percentageChange: 0,
      formatted: `${avgResponseHours.toFixed(1)}h`,
    },
    aiResolvedTickets: {
      current: aiResolvedCount,
      percentage: Math.round(aiResolvedPercentage),
      percentageChange: 0, // Simplified for now
    },
  };
}

export async function getDashboardChartData(companyId: string): Promise<ChartData> {
  if (!companyId) {
    throw new Error('Company ID is required');
  }

  // Status Distribution
  const { data: statusData } = await supabase
    .from('tickets')
    .select('status')
    .eq('company_id', companyId);

  const statusCounts = statusData?.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    name: status === 'new' ? 'Novos' : 
          status === 'in_progress' ? 'Em Progresso' :
          status === 'waiting_for_client' ? 'Aguardando' :
          status === 'resolved' ? 'Resolvidos' : status,
    value: count,
    color: status === 'resolved' ? '#10B981' :
           status === 'in_progress' ? '#06B6D4' :
           status === 'waiting_for_client' ? '#6366f1' : '#1E3A8A',
  }));

  // Historical Data (last 6 months)
  const historicalData = [];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  
  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth() - (5 - i), 1);
    const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() - (5 - i) + 1, 0);
    
    const { data: monthTickets } = await supabase
      .from('tickets')
      .select('id, status')
      .eq('company_id', companyId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString());

    const totalTickets = monthTickets?.length || 0;
    const resolvedTickets = monthTickets?.filter(t => t.status === 'resolved').length || 0;

    historicalData.push({
      name: months[i],
      tickets: totalTickets,
      resolved: resolvedTickets,
    });
  }

  // Category Data
  const { data: categoryData } = await supabase
    .from('tickets')
    .select('category')
    .eq('company_id', companyId);

  const categoryCounts = categoryData?.reduce((acc, ticket) => {
    const category = ticket.category || 'Não categorizado';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const categoryDataFormatted = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category === 'technical_issue' ? 'Problema Técnico' :
          category === 'feature_request' ? 'Solicitação de Recurso' :
          category === 'billing' ? 'Faturamento' :
          category === 'general_inquiry' ? 'Dúvida Geral' : category,
    value: count,
  }));

  // AI Metrics (simplified)
  const { data: aiProcessedTickets } = await supabase
    .from('tickets')
    .select('ai_processed, needs_human_review, confidence_score')
    .eq('company_id', companyId)
    .eq('ai_processed', true);

  const totalAiProcessed = aiProcessedTickets?.length || 0;
  const successfullyClassified = aiProcessedTickets?.filter(t => !t.needs_human_review).length || 0;
  const classificationAccuracy = totalAiProcessed > 0 ? (successfullyClassified / totalAiProcessed) * 100 : 0;

  return {
    statusDistribution,
    historicalData,
    categoryData: categoryDataFormatted,
    aiMetrics: {
      classificationAccuracy: Math.round(classificationAccuracy),
      suggestedResponseAccuracy: 76, // Placeholder - would need suggested_responses table analysis
      avgProcessingTime: 4.2, // Placeholder - would need processing time tracking
    },
  };
}
