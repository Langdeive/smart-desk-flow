
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

type Plan = {
  id: string;
  name: string;
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

type PlanContextType = {
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan) => void;
  selectPlanAndProceed: (plan: Plan) => void;
};

const PlanSelectContext = createContext<PlanContextType | undefined>(undefined);

export const PlanSelectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();

  const selectPlanAndProceed = (plan: Plan) => {
    setSelectedPlan(plan);
    navigate('/cadastro-empresa');
  };

  return (
    <PlanSelectContext.Provider value={{ selectedPlan, setSelectedPlan, selectPlanAndProceed }}>
      {children}
    </PlanSelectContext.Provider>
  );
};

export const usePlanSelect = () => {
  const context = useContext(PlanSelectContext);
  if (context === undefined) {
    throw new Error('usePlanSelect must be used within a PlanSelectProvider');
  }
  return context;
};
