import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Ticket, BookOpen, Settings, LayoutDashboard } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const showOnlyAuth = location.pathname === '/';
  
  return (
    <div className="border-b mb-4">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">HelpDesk IA</h1>
        </div>
        
        {!showOnlyAuth && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Início
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/dashboard") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  isActive("/tickets") || 
                  isActive("/tickets/new") || 
                  location.pathname.startsWith("/tickets/") ? "bg-accent text-accent-foreground" : ""
                )}>
                  <div className="flex items-center">
                    <Ticket className="w-4 h-4 mr-2" />
                    Tickets
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-2">
                    <li>
                      <Link to="/tickets">
                        <NavigationMenuLink 
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/tickets") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Lista de Tickets</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ver todos os tickets
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/tickets/new">
                        <NavigationMenuLink 
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive("/tickets/new") && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">Novo Ticket</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Criar uma nova solicitação
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/knowledge">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/knowledge") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Base de Conhecimento
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/settings">
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/settings") && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        
        <div className="flex items-center gap-4">
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
        </div>
      </div>
    </div>
  );
}
