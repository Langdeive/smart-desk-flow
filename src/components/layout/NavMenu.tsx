
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Ticket, 
  BookOpen, 
  Settings, 
  LayoutDashboard, 
  Users, 
  UserCircle,
  Plus,
  Sun,
  Moon
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import { NewTicketModal } from "@/components/ticket/NewTicketModal";

export function NavMenu() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isSubPathActive = (path: string) => location.pathname.startsWith(path);
  const { theme, setTheme } = useTheme();
  
  // Mock user state - this would be replaced with actual auth state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  
  // Simulating user login for demonstration
  useEffect(() => {
    // In a real application, this would be replaced with actual auth check
    setTimeout(() => {
      setUser({ name: "John Doe", email: "john@example.com" });
    }, 1000);
  }, []);
  
  const cadastrosLinks = [
    { label: "Clientes", href: "/configuracoes/clientes", icon: Users },
    { label: "Agentes", href: "/configuracoes/agentes", icon: UserCircle }
  ];
  
  const showOnlyAuth = location.pathname === '/';
  
  return (
    <div className="border-b mb-4">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">HelpDesk IA</h1>
        </div>
        
        {(!showOnlyAuth || user) && (
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
              
              <NavigationMenuItem>
                <Link to="/settings" className={cn(
                  navigationMenuTriggerStyle(),
                  isActive("/settings") && "bg-accent text-accent-foreground"
                )}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        
        <div className="flex items-center gap-4">
          {!user ? (
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
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="/profile" className="flex w-full">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="flex w-full">Configurações</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button className="flex w-full text-left" onClick={() => setUser(null)}>
                      Sair
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
