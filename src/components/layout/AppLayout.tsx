
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Mostrar tela de carregamento enquanto autenticação está sendo verificada
  if (loading) {
    return <LoadingScreen message="Carregando aplicação..." />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        minHeight: '100vh'
      }}
    >
      <NavMenu />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}
