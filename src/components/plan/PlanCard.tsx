
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlanProps = {
  id: string;
  nome: string; // Changed from 'name' to 'nome' to match database field
  description: string;
  price: number;
  monthlyPrice: number;
  maxUsers: number;
  maxTickets: number;
  hasAiFeatures: boolean;
  hasPremiumSupport: boolean;
  features: string[];
  isFeatured: boolean;
};

interface PlanCardProps {
  plan: PlanProps;
  onSelect: (plan: PlanProps) => void;
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  const {
    nome, // Changed from 'name' to 'nome'
    description,
    monthlyPrice,
    features,
    isFeatured
  } = plan;
  
  return (
    <Card className={cn(
      "flex flex-col",
      isFeatured && "border-primary shadow-lg"
    )}>
      <CardHeader className={cn(
        "flex flex-col items-center text-center",
        isFeatured && "bg-primary text-primary-foreground"
      )}>
        {isFeatured && (
          <div className="py-1 px-3 text-xs font-medium bg-white text-primary rounded-full mb-2">
            Mais Popular
          </div>
        )}
        <CardTitle>{nome}</CardTitle>
        <CardDescription className={isFeatured ? "text-primary-foreground/90" : ""}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold">
            {monthlyPrice === 0 ? "Grátis" : `R$ ${monthlyPrice.toFixed(2)}`}
            {monthlyPrice > 0 && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
          </p>
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSelect(plan)} 
          className={cn(
            "w-full", 
            isFeatured ? "bg-primary hover:bg-primary/90" : ""
          )}
        >
          Selecionar Plano
        </Button>
      </CardFooter>
    </Card>
  );
}
