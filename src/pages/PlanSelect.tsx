
import React from 'react';
import { PlanList } from '@/components/plan/PlanList';
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';

export default function PlanSelect() {
  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Escolha o plano ideal para sua empresa</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Selecione o plano que melhor atende às necessidades da sua empresa. 
          Todos os planos incluem acesso completo ao sistema de tickets.
        </p>
      </div>

      <Separator className="my-8" />
      
      <PlanList />
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-2">
          Já possui uma conta?
        </p>
        <Link to="/login" className="text-primary hover:underline">
          Faça login aqui
        </Link>
      </div>
    </div>
  );
}
