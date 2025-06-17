
import { useQuery } from '@tanstack/react-query';
import { getDashboardKPIs, getDashboardChartData } from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardKPIs {
  totalTickets: {
    current: number;
    previousMonth: number;
    percentageChange: number;
  };
  resolutionRate: {
    current: number;
    previousMonth: number;
    percentageChange: number;
  };
  avgResponseTime: {
    current: number; // in hours
    previousMonth: number;
    percentageChange: number;
    formatted: string;
  };
  aiResolvedTickets: {
    current: number;
    percentage: number;
    percentageChange: number;
  };
}

export interface ChartData {
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  historicalData: Array<{
    name: string;
    tickets: number;
    resolved: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  aiMetrics: {
    classificationAccuracy: number;
    suggestedResponseAccuracy: number;
    avgProcessingTime: number;
  };
}

export function useDashboardData() {
  const { user } = useAuth();
  const companyId = user?.user_metadata?.company_id;

  const {
    data: kpis,
    isLoading: kpisLoading,
    error: kpisError,
  } = useQuery({
    queryKey: ['dashboard-kpis', companyId],
    queryFn: () => getDashboardKPIs(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const {
    data: chartData,
    isLoading: chartsLoading,
    error: chartsError,
  } = useQuery({
    queryKey: ['dashboard-charts', companyId],
    queryFn: () => getDashboardChartData(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    kpis,
    chartData,
    isLoading: kpisLoading || chartsLoading,
    error: kpisError || chartsError,
    refetch: () => {
      // Could add manual refetch logic here if needed
    },
  };
}
