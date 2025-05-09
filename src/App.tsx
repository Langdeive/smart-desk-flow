
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PlanSelectProvider } from "./contexts/PlanSelectContext";
import { ThemeProvider } from "./hooks/use-theme";
import { RequireAuth } from "./components/auth/RequireAuth";
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
import ClientManagement from './pages/ClientManagement';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <PlanSelectProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/selecionar-plano" element={<PlanSelect />} />
                  <Route path="/dashboard" element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  } />
                  <Route path="/tickets" element={
                    <RequireAuth>
                      <TicketDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/tickets/new" element={
                    <RequireAuth>
                      <CreateTicket />
                    </RequireAuth>
                  } />
                  <Route path="/tickets/:id" element={
                    <RequireAuth>
                      <TicketDetail />
                    </RequireAuth>
                  } />
                  <Route path="/knowledge" element={
                    <RequireAuth>
                      <KnowledgeBase />
                    </RequireAuth>
                  } />
                  <Route path="/settings" element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  } />
                  <Route path="/configuracoes/agentes" element={
                    <RequireAuth allowedRoles={['admin']}>
                      <AgentManagement />
                    </RequireAuth>
                  } />
                  <Route path="/configuracoes/clientes" element={
                    <RequireAuth>
                      <ClientManagement />
                    </RequireAuth>
                  } />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cadastro-empresa" element={<CompanyRegister />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </PlanSelectProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
