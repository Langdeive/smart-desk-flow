
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  LayoutDashboard,
  Ticket,
  Users,
  UserCircle,
  BookOpen,
  Settings,
} from "lucide-react";
import Logo from "@/components/ui/logo";

export function Sidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  
  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => 
    paths.some(path => location.pathname.startsWith(path));
  
  const navGroups = [
    {
      title: "Suporte",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Central de Atendimento", href: "/workspace", icon: Ticket },
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
  
  return (
    <SidebarPrimitive className="border-r border-turquoise-vibrant/20 bg-white">
      <div className="p-4 border-b border-turquoise-vibrant/20 bg-gradient-to-r from-blue-deep/5 to-turquoise-vibrant/5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo />
          {state === "expanded" && (
            <span className="font-semibold text-blue-deep">SolveFlow</span>
          )}
        </Link>
      </div>
      
      <SidebarContent className="bg-gradient-to-b from-transparent to-purple-intense/5">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link to="/dashboard">
                  <Home className="h-5 w-5" />
                  <span>Início</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {navGroups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-blue-deep font-outfit">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </SidebarPrimitive>
  );
}
