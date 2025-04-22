
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTicketModal } from "@/components/ticket/NewTicketModal";
import { MainNav } from "./MainNav";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function NavMenu() {
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const location = useLocation();

  const showOnlyAuth = location.pathname === '/';

  return (
    <div className="border-b mb-4">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">HelpDesk IA</h1>
        </div>
        {/* Exibe MainNav apenas se não autenticado e não está na tela de dashboard */}
        {!isAuthenticated && (!showOnlyAuth) && <MainNav />}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login"
                className="text-sm font-medium text-primary"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Cadastrar
              </Link>
            </>
          ) : (
            <>
              <Button 
                variant="default" 
                onClick={() => setShowNewTicketModal(true)}
                className="mr-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Ticket
              </Button>
              <ThemeToggle />
              {user && (
                <UserMenu 
                  user={{ 
                    name: user.user_metadata?.company_name || user.email?.split('@')[0] || "Usuário", 
                    email: user.email || "" 
                  }} 
                  onSignOut={signOut} 
                />
              )}
            </>
          )}
        </div>
      </div>
      {showNewTicketModal && (
        <NewTicketModal open={showNewTicketModal} onClose={() => setShowNewTicketModal(false)} />
      )}
    </div>
  );
}
