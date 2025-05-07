
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PlanDisplayProps = {
  plan: {
    nome: string;
    monthlyPrice: number;
    maxUsers: number;
    maxTickets: number;
    hasAiFeatures: boolean;
    hasPremiumSupport: boolean;
  };
};

export function SelectedPlanCard({ plan }: PlanDisplayProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Plano selecionado: {plan.nome}</CardTitle>
        <CardDescription>
          {plan.monthlyPrice === 0 
            ? "Plano gratuito" 
            : `R$ ${plan.monthlyPrice.toFixed(2)}/mês`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          <li>Até {plan.maxUsers} usuários</li>
          <li>Até {plan.maxTickets} tickets por mês</li>
          {plan.hasAiFeatures && <li>Recursos de IA inclusos</li>}
          {plan.hasPremiumSupport && <li>Suporte premium</li>}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => navigate('/selecionar-plano')}>
          Alterar plano
        </Button>
      </CardFooter>
    </Card>
  );
}
