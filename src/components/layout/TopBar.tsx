
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "@/components/ui/logo";
import { useLocation } from "react-router-dom";

const getPageTitle = (pathname: string) => {
  const routes: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/tickets': 'Tickets',
    '/create-ticket': 'Criar Ticket',
    '/clients': 'Clientes',
    '/agents': 'Agentes',
    '/knowledge-base': 'Base de Conhecimento',
    '/helena': 'Helena IA',
    '/settings': 'Configurações',
  };

  // Handle dynamic routes like /tickets/:id
  if (pathname.startsWith('/tickets/') && pathname !== '/tickets') {
    return 'Detalhes do Ticket';
  }

  return routes[pathname] || 'SolveFlow';
};

export function TopBar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const userData = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || ''
  } : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 force-white-header">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo variant="icon" className="lg:hidden" />
          <h1 className="text-lg font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
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
