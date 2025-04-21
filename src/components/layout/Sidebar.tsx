
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  Ticket,
  Users,
  UserCircle,
  BookOpen,
  Settings,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => 
    paths.some(path => location.pathname.startsWith(path));
  
  const navGroups = [
    {
      title: "Suporte",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Tickets", href: "/tickets", icon: Ticket },
      ],
    },
    {
      title: "Cadastros",
      items: [
        { label: "Clientes", href: "/configuracoes/clientes", icon: Users },
        { label: "Agentes", href: "/configuracoes/agentes", icon: UserCircle },
      ],
    },
    {
      title: "Base de Conhecimento",
      items: [
        { label: "Artigos", href: "/knowledge", icon: BookOpen },
      ],
    },
    {
      title: "Configurações",
      items: [
        { label: "Geral", href: "/settings", icon: Settings },
      ],
    },
  ];
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-background border-r transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">HelpDesk IA</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <Link
            to="/"
            className={cn(
              "flex items-center mx-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActive("/") 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Início</span>
          </Link>
          
          <Accordion type="multiple" className="w-full mt-4">
            {navGroups.map((group, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                <AccordionTrigger 
                  className={cn(
                    "px-3 py-2 text-sm hover:bg-muted rounded-md mx-3",
                    isGroupActive(group.items.map(item => item.href)) && "font-medium"
                  )}
                >
                  {group.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    {group.items.map((item, i) => (
                      <Link
                        key={i}
                        to={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                          isActive(item.href) 
                            ? "bg-accent text-accent-foreground font-medium" 
                            : "hover:bg-muted"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                        {isActive(item.href) && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Fechar Menu
          </Button>
        </div>
      </div>
    </>
  );
}
