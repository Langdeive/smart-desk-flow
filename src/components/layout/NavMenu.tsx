
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TicketCheck, 
  Users, 
  BookOpen, 
  Settings, 
  UserPlus,
  Bot
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "agent", "owner", "developer"]
  },
  {
    name: "Tickets",
    href: "/tickets",
    icon: TicketCheck,
    roles: ["admin", "agent", "owner", "developer"]
  },
  {
    name: "Clientes",
    href: "/clients",
    icon: Users,
    roles: ["admin", "agent", "owner", "developer"]
  },
  {
    name: "Base de Conhecimento",
    href: "/knowledge-base",
    icon: BookOpen,
    roles: ["admin", "agent", "owner", "developer"]
  },
  {
    name: "Helena - IA",
    href: "/helena",
    icon: Bot,
    roles: ["admin", "owner", "developer"]
  },
  {
    name: "Agentes",
    href: "/agents",
    icon: UserPlus,
    roles: ["admin", "owner", "developer"]
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "owner", "developer"]
  },
];

export function NavMenu() {
  const location = useLocation();
  const { role } = useAuth();

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(role || "")
  );

  return (
    <nav className="space-y-1">
      {visibleMenuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
            location.pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
