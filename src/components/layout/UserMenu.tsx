
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface UserMenuProps {
  user: { name: string; email: string } | null;
  onSignOut: () => void;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  if (!user) return null;
  
  // Get the first letter of the user's name for the avatar
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-turquoise-vibrant focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:bg-cyan-50"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-turquoise-vibrant text-white font-semibold border-2 border-turquoise-vibrant">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 force-popover-white bg-white border-gray-200" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">{user.name}</p>
            <p className="text-xs leading-none text-gray-500">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-cyan-50 hover:text-turquoise-vibrant focus:bg-cyan-50 focus:text-turquoise-vibrant">
            <Link to="/profile" className="flex w-full text-gray-900">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-cyan-50 hover:text-turquoise-vibrant focus:bg-cyan-50 focus:text-turquoise-vibrant">
            <Link to="/settings" className="flex w-full text-gray-900">Configurações</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem className="hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
          <button className="flex w-full text-left text-gray-900" onClick={onSignOut}>
            Sair
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
