
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileHeaderProps {
  avatarUrl?: string;
  onAvatarUpdate: (url: string | null) => void;
}

export function ProfileHeader({ avatarUrl, onAvatarUpdate }: ProfileHeaderProps) {
  const { user, role } = useAuth();

  if (!user) return null;

  const userInitial = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.charAt(0).toUpperCase() 
    : user.email?.charAt(0).toUpperCase() || 'U';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';

  const roleLabels = {
    admin: 'Administrador',
    owner: 'Proprietário',
    agent: 'Agente',
    client: 'Cliente',
    developer: 'Desenvolvedor'
  };

  const roleColors = {
    admin: 'bg-blue-500',
    owner: 'bg-purple-500',
    agent: 'bg-green-500',
    client: 'bg-orange-500',
    developer: 'bg-red-500'
  };

  return (
    <Card className="force-white-card">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            userInitial={userInitial}
            onAvatarUpdate={onAvatarUpdate}
          />
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2 flex flex-col md:flex-row items-center gap-2">
              <Badge variant="secondary" className="bg-turquoise-vibrant text-white">
                {roleLabels[role as keyof typeof roleLabels] || 'Usuário'}
              </Badge>
              <span className="text-sm text-gray-500">
                Membro desde {new Date(user.created_at || '').toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
