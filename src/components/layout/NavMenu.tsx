
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTicketModal } from "@/components/ticket/NewTicketModal";
import { MainNav } from "./MainNav";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";

export function NavMenu() {
  // Mock user state - this would be replaced with actual auth state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  
  // Simulating user login for demonstration
  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "John Doe", email: "john@example.com" });
    }, 1000);
  }, []);
  
  const showOnlyAuth = location.pathname === '/';
  
  return (
    <div className="border-b mb-4">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">HelpDesk IA</h1>
        </div>
        
        {(!showOnlyAuth || user) && <MainNav />}
        
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
              
              <ThemeToggle />
              <UserMenu user={user} onSignOut={() => setUser(null)} />
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
