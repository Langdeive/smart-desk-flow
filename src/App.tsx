
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
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
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import CompanyRegister from "./pages/CompanyRegister";
import PlanSelect from "./pages/PlanSelect";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/company-register" element={<CompanyRegister />} />
              <Route path="/selecionar-plano" element={<PlanSelect />} />
              
              {/* Protected routes */}
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
              
              <Route path="/tickets/:id" element={
                <RequireAuth>
                  <TicketDetail />
                </RequireAuth>
              } />
              
              <Route path="/create-ticket" element={
                <RequireAuth>
                  <CreateTicket />
                </RequireAuth>
              } />
              
              <Route path="/clients" element={
                <RequireAuth>
                  <ClientManagement />
                </RequireAuth>
              } />
              
              <Route path="/agents" element={
                <RequireAuth allowedRoles={['admin', 'owner']}>
                  <AgentManagement />
                </RequireAuth>
              } />
              
              <Route path="/knowledge-base" element={
                <RequireAuth>
                  <KnowledgeBase />
                </RequireAuth>
              } />
              
              <Route path="/helena" element={
                <RequireAuth allowedRoles={['admin', 'owner']}>
                  <HelenaArticles />
                </RequireAuth>
              } />
              
              <Route path="/settings" element={
                <RequireAuth allowedRoles={['admin', 'owner']}>
                  <Settings />
                </RequireAuth>
              } />
              
              {/* Error routes */}
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
