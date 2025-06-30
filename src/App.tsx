
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SecureCspHeaders } from "@/components/security/SecureCspHeaders";
import { AppLayout } from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import AgentManagement from '@/pages/AgentManagement';
import ClientManagement from '@/pages/ClientManagement';
import TicketDashboard from '@/pages/TicketDashboard';
import TicketDetail from '@/pages/TicketDetail';
import CreateTicket from '@/pages/CreateTicket';
import KnowledgeBase from '@/pages/KnowledgeBase';
import HelenaArticles from '@/pages/HelenaArticles';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import CompanyRegister from '@/pages/CompanyRegister';
import PlanSelect from '@/pages/PlanSelect';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AgentWorkspace from '@/pages/AgentWorkspace';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <SecureCspHeaders />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas (sem layout) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/company-register" element={<CompanyRegister />} />
              <Route path="/plan-select" element={<PlanSelect />} />
              
              {/* Workspace tem seu próprio layout */}
              <Route 
                path="/workspace" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'agent', 'owner', 'developer']}>
                    <AgentWorkspace />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas (com AppLayout) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'developer']}>
                    <AppLayout>
                      <AgentManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ClientManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tickets" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TicketDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tickets/:id" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TicketDetail />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-ticket" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CreateTicket />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/knowledge-base" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <KnowledgeBase />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/helena" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'developer']}>
                    <AppLayout>
                      <HelenaArticles />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner', 'developer']}>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirecionamentos */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
