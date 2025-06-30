
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TicketDashboard from "./pages/TicketDashboard";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import ClientManagement from "./pages/ClientManagement";
import AgentManagement from "./pages/AgentManagement";
import KnowledgeBase from "./pages/KnowledgeBase";
import HelenaArticles from "./pages/HelenaArticles";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import CompanyRegister from "./pages/CompanyRegister";
import PlanSelect from "./pages/PlanSelect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
              <Route path="/company-register" element={<AuthLayout><CompanyRegister /></AuthLayout>} />
              <Route path="/selecionar-plano" element={<AuthLayout><PlanSelect /></AuthLayout>} />
              
              {/* Protected routes with AppLayout */}
              <Route path="/dashboard" element={
                <RequireAuth>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/tickets" element={
                <RequireAuth>
                  <AppLayout>
                    <TicketDashboard />
                  </AppLayout>
                </RequireAuth>
              } />

              <Route path="/tickets/new" element={
                <RequireAuth>
                  <AppLayout>
                    <CreateTicket />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/tickets/:id" element={
                <RequireAuth>
                  <AppLayout>
                    <TicketDetail />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/clients" element={
                <RequireAuth>
                  <AppLayout>
                    <ClientManagement />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/agents" element={
                <RequireAuth allowedRoles={['admin', 'owner', 'developer']}>
                  <AppLayout>
                    <AgentManagement />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/knowledge-base" element={
                <RequireAuth>
                  <AppLayout>
                    <KnowledgeBase />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/helena" element={
                <RequireAuth allowedRoles={['admin', 'owner', 'developer']}>
                  <AppLayout>
                    <HelenaArticles />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/settings" element={
                <RequireAuth allowedRoles={['admin', 'owner', 'developer']}>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </RequireAuth>
              } />
              
              <Route path="/profile" element={
                <RequireAuth>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </RequireAuth>
              } />
              
              {/* Error routes */}
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
