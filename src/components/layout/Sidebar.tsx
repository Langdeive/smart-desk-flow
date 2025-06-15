
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
        { label: "Clientes", href: "/clients", icon: Users },
        { label: "Agentes", href: "/agents", icon: UserCircle },
      ],
    },
    {
      title: "Base de Conhecimento",
      items: [
        { label: "Artigos", href: "/knowledge-base", icon: BookOpen },
      ],
    },
    {
      title: "Configurações",
      items: [
        { label: "Geral", href: "/settings", icon: Settings },
      ],
    },
  ];
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden border-turquoise-vibrant text-blue-deep hover:bg-turquoise-vibrant/10"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-turquoise-vibrant/20 transition-transform duration-default ease-in-out shadow-modern",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="p-4 border-b border-turquoise-vibrant/20 bg-gradient-to-r from-blue-deep/5 to-turquoise-vibrant/5">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4 bg-gradient-to-b from-transparent to-purple-intense/5">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center mx-3 px-3 py-2 rounded-lg text-sm transition-all duration-default font-medium",
              isActive("/dashboard") 
                ? "bg-gradient-to-r from-blue-deep to-turquoise-vibrant text-white shadow-modern transform scale-[1.02]" 
                : "text-blue-deep hover:bg-gradient-to-r hover:from-turquoise-vibrant/10 hover:to-purple-intense/10 hover:text-turquoise-vibrant"
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
                    "px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-intense/10 hover:to-turquoise-vibrant/10 rounded-lg mx-3 text-blue-deep font-outfit transition-all duration-default",
                    isGroupActive(group.items.map(item => item.href)) && "font-semibold text-purple-intense bg-gradient-to-r from-purple-intense/5 to-turquoise-vibrant/5"
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
                          "flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-default font-medium",
                          isActive(item.href) 
                            ? "bg-gradient-to-r from-turquoise-vibrant/20 to-purple-intense/20 text-purple-intense border-l-2 border-turquoise-vibrant transform scale-[1.02]" 
                            : "text-blue-deep hover:bg-gradient-to-r hover:from-turquoise-vibrant/10 hover:to-purple-intense/5 hover:text-turquoise-vibrant"
                        )}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.label}</span>
                        {isActive(item.href) && (
                          <ChevronRight className="ml-auto h-4 w-4 text-turquoise-vibrant" />
                        )}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {isOpen && (
          <div className="p-4 border-t border-turquoise-vibrant/20 lg:hidden bg-gradient-to-r from-blue-deep/5 to-turquesa-vibrant/5">
            <Button 
              variant="outline" 
              className="w-full border-turquoise-vibrant text-blue-deep hover:bg-turquoise-vibrant hover:text-white" 
              onClick={() => setIsOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Fechar Menu
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
