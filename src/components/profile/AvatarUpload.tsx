
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Loader2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userInitial: string;
  onAvatarUpdate: (url: string | null) => void;
  className?: string;
}

export function AvatarUpload({ currentAvatarUrl, userInitial, onAvatarUpdate, className }: AvatarUploadProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    // Validar tipo e tamanho do arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      toast.error('A imagem deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Remove avatar anterior se existir
      if (currentAvatarUrl) {
        const oldFileName = currentAvatarUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Upload do novo avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      // Atualizar user_preferences
      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          avatar_url: avatarUrl
        });

      if (updateError) throw updateError;

      onAvatarUpdate(avatarUrl);
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao atualizar avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setIsUploading(true);

    try {
      // Remove arquivo do storage
      const fileName = currentAvatarUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${fileName}`]);
      }

      // Atualizar user_preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          avatar_url: null
        });

      if (error) throw error;

      onAvatarUpdate(null);
      toast.success('Avatar removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      toast.error('Erro ao remover avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <AvatarImage src={currentAvatarUrl} alt="Avatar do usuário" />
          <AvatarFallback className="text-2xl font-semibold text-white bg-turquoise-vibrant">
            {userInitial}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="border-turquoise-vibrant text-turquoise-vibrant hover:bg-cyan-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          {currentAvatarUrl ? 'Alterar' : 'Upload'}
        </Button>

        {currentAvatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            disabled={isUploading}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Remover
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center">
        Clique no avatar ou no botão para alterar.<br />
        Formatos aceitos: JPG, PNG (máx. 2MB)
      </p>
    </div>
  );
}
