
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Remover Sidebar e barra superior na landing page "/" e na página de seleção de plano
  const isLanding = location.pathname === "/" || location.pathname === "/selecionar-plano";
  
  // Mostrar tela de carregamento enquanto autenticação está sendo verificada
  if (loading && !isLanding && location.pathname !== "/login" && location.pathname !== "/register") {
    return <LoadingScreen message="Carregando aplicação..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isLanding && <NavMenu />}
      <div className="flex flex-1">
        {/* Botão mobile para abrir sidebar */}
        {!isLanding && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 z-40 lg:hidden shadow-lg"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {/* Sidebar mobile/desktop visíveis apenas fora do landing */}
        {!isLanding && showSidebar && (
          <div className="lg:hidden">
            <Sidebar />
          </div>
        )}
        {!isLanding && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        <main className={isLanding ? "flex-1" : "flex-1 lg:ml-64"}>
          <Outlet />
        </main>
      </div>
      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}
