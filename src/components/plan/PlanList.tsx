
import React from 'react';
import { PlanCard, PlanProps } from './PlanCard';
import { usePlanSelect } from '@/contexts/PlanSelectContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function PlanList() {
  const { selectPlanAndProceed } = usePlanSelect();

  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('monthly_price', { ascending: true });

      if (error) throw error;

      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        monthlyPrice: plan.monthly_price,
        maxUsers: plan.max_users,
        maxTickets: plan.max_tickets,
        hasAiFeatures: plan.has_ai_features,
        hasPremiumSupport: plan.has_premium_support,
        features: plan.features as string[],
        isFeatured: plan.is_featured
      })) as PlanProps[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Carregando planos...</div>
      </div>
    );
  }

  if (error || plans.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Erro ao carregar planos</h3>
        <p className="text-muted-foreground">
          Por favor, tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onSelect={selectPlanAndProceed} />
      ))}
    </div>
  );
}
