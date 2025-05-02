
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
import Logo from "@/components/ui/logo";

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
        {isOpen ? <X className="h-5 w-5 text-neutral-700" /> : <Menu className="h-5 w-5 text-neutral-700" />}
      </Button>
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white dark:bg-neutral-900 border-r transition-transform duration-default ease-in-out shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <Link
            to="/"
            className={cn(
              "flex items-center mx-3 px-3 py-2 rounded-lg text-sm transition-colors duration-default",
              isActive("/") 
                ? "bg-primary-a text-white" 
                : "text-neutral-700 hover:bg-neutral-100"
            )}
          >
            <Home className="mr-2 h-5 w-5" />
            <span>Início</span>
          </Link>
          
          <Accordion type="multiple" className="w-full mt-4">
            {navGroups.map((group, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                <AccordionTrigger 
                  className={cn(
                    "px-3 py-2 text-sm hover:bg-neutral-100 rounded-lg mx-3 text-neutral-700",
                    isGroupActive(group.items.map(item => item.href)) && "font-medium text-neutral-900"
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
                          "flex items-center rounded-lg px-3 py-2 text-sm transition-colors duration-default",
                          isActive(item.href) 
                            ? "bg-primary-a-50 text-primary-a font-medium" 
                            : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
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
