import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PlanSelectProvider } from "./contexts/PlanSelectContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TicketDashboard from "./pages/TicketDashboard";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import KnowledgeBase from "./pages/KnowledgeBase";
import Settings from "./pages/Settings";
import PlanSelect from "./pages/PlanSelect";
import CompanyRegister from "./pages/CompanyRegister";
import AgentManagement from './pages/AgentManagement';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PlanSelectProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketDashboard />} />
                <Route path="/tickets/new" element={<CreateTicket />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/selecionar-plano" element={<PlanSelect />} />
                <Route path="/configuracoes/agentes" element={<AgentManagement />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cadastro-empresa" element={<CompanyRegister />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </PlanSelectProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
