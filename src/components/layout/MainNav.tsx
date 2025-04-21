
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  LayoutDashboard, 
  Ticket, 
  Users, 
  UserCircle, 
  BookOpen 
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isSubPathActive = (path: string) => location.pathname.startsWith(path);

  const cadastrosLinks = [
    { label: "Clientes", href: "/configuracoes/clientes", icon: Users },
    { label: "Agentes", href: "/configuracoes/agentes", icon: UserCircle }
  ];

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
        
        <NavigationMenuItem>
          <Link to="/dashboard" className={cn(
            navigationMenuTriggerStyle(),
            isActive("/dashboard") && "bg-accent text-accent-foreground"
          )}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            isSubPathActive("/tickets") ? "bg-accent text-accent-foreground" : ""
          )}>
            <div className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Tickets
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-2">
              <li>
                <Link to="/tickets" className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  isActive("/tickets") && "bg-accent text-accent-foreground"
                )}>
                  <div className="text-sm font-medium leading-none">Lista de Tickets</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Ver todos os tickets
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/tickets/new" className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  isActive("/tickets/new") && "bg-accent text-accent-foreground"
                )}>
                  <div className="text-sm font-medium leading-none">Novo Ticket</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Criar uma nova solicitação
                  </p>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            isSubPathActive("/configuracoes/clientes") || isSubPathActive("/configuracoes/agentes") ? "bg-accent text-accent-foreground" : ""
          )}>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Cadastros
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-2">
              {cadastrosLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isActive(link.href) && "bg-accent text-accent-foreground"
                  )}>
                    <div className="text-sm font-medium leading-none flex items-center">
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gerenciar {link.label.toLowerCase()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/knowledge" className={cn(
            navigationMenuTriggerStyle(),
            isActive("/knowledge") && "bg-accent text-accent-foreground"
          )}>
            <BookOpen className="w-4 h-4 mr-2" />
            Base de Conhecimento
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
