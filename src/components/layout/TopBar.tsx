
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "@/components/ui/logo";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const userData = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || ''
  } : null;

  // Show workspace info when on workspace page
  const isWorkspacePage = location.pathname === '/workspace';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 force-white-header">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo variant="full" size="sm" />
          {isWorkspacePage && (
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Central de Atendimento
              </Badge>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-green-600 font-medium">
                Agente: {userData?.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isWorkspacePage && (
            <div className="hidden sm:flex text-xs text-gray-500 items-center gap-2">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">J</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">K</kbd> navegar • 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1 text-xs">Esc</kbd> fechar
            </div>
          )}
          <ThemeToggle />
          <UserMenu 
            user={userData}
            onSignOut={signOut}
          />
        </div>
      </div>
    </header>
  );
}
