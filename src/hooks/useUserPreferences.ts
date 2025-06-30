
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  in_app: boolean;
}

interface UserPreferences {
  avatar_url?: string;
  department?: string;
  timezone: string;
  language: string;
  notifications: NotificationSettings;
}

const defaultPreferences: UserPreferences = {
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  notifications: {
    email: true,
    push: true,
    in_app: true
  }
};

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar preferências do usuário
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          throw error;
        }

        if (data) {
          // Parse notifications from JSONB safely
          let parsedNotifications = defaultPreferences.notifications;
          if (data.notifications) {
            try {
              // Handle case where notifications is already an object or needs parsing
              parsedNotifications = typeof data.notifications === 'string' 
                ? JSON.parse(data.notifications) 
                : data.notifications as NotificationSettings;
            } catch {
              parsedNotifications = defaultPreferences.notifications;
            }
          }

          setPreferences({
            avatar_url: data.avatar_url || undefined,
            department: data.department || undefined,
            timezone: data.timezone || defaultPreferences.timezone,
            language: data.language || defaultPreferences.language,
            notifications: parsedNotifications
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar preferências:', error);
        toast.error('Erro ao carregar preferências do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Salvar preferências
  const savePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          avatar_url: updatedPreferences.avatar_url,
          department: updatedPreferences.department,
          timezone: updatedPreferences.timezone,
          language: updatedPreferences.language,
          notifications: updatedPreferences.notifications as any // Cast to bypass strict typing for JSONB
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
      toast.success('Preferências salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helpers para atualizações específicas
  const updateAvatar = (avatar_url: string | null) => {
    const newPreferences = { ...preferences, avatar_url: avatar_url || undefined };
    setPreferences(newPreferences);
  };

  const updateDepartment = (department: string) => {
    savePreferences({ department });
  };

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    const newNotifications = { ...preferences.notifications, [key]: value };
    savePreferences({ notifications: newNotifications });
  };

  const updateTimezone = (timezone: string) => {
    savePreferences({ timezone });
  };

  const updateLanguage = (language: string) => {
    savePreferences({ language });
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updateAvatar,
    updateDepartment,
    updateNotification,
    updateTimezone,
    updateLanguage,
    savePreferences
  };
}
