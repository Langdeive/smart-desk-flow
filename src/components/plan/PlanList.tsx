
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
        .from('planos')  // Corrigido: 'plans' para 'planos'
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      // Mapeando os campos do banco de dados para os campos esperados pelo componente
      return data.map(plan => ({
        id: plan.id,
        name: plan.nome,
        description: plan.descricao || '',
        price: 0, // Definindo um valor padrão para os campos que não existem no banco de dados
        monthlyPrice: 0, // Você precisa adicionar estes campos no banco ou modificar o componente para não usá-los
        maxUsers: 10,
        maxTickets: 100,
        hasAiFeatures: true,
        hasPremiumSupport: true,
        features: ['Suporte básico', 'Até 10 usuários', 'Até 100 tickets por mês'],
        isFeatured: false
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
