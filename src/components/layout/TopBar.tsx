
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "@/components/ui/logo";

export function TopBar() {
  const { user, signOut } = useAuth();

  const userData = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
    email: user.email || ''
  } : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 force-white-header">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Logo variant="full" size="sm" />
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu 
            user={userData}
            onSignOut={signOut}
          />
        </div>
      </div>
    </header>
  );
}
