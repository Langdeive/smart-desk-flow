
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";

export function MainNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  // Só exibe "Início" enquanto NÃO autenticado
  if (isAuthenticated) {
    return null;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={cn(
            navigationMenuTriggerStyle(),
            isActive("/") && "bg-accent text-accent-foreground"
          )}>
            <Home className="w-4 h-4 mr-2" />
            Início
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
