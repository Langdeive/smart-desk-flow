
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecuritySettings {
  two_factor_enabled: boolean;
  login_notifications: boolean;
  session_timeout: number;
  allowed_ip_addresses: string[];
  failed_login_attempts: number;
  account_locked_until?: string;
}

const defaultSecuritySettings: SecuritySettings = {
  two_factor_enabled: false,
  login_notifications: true,
  session_timeout: 480, // 8 horas
  allowed_ip_addresses: [],
  failed_login_attempts: 0
};

export function useUserSecuritySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadSecuritySettings = async () => {
      try {
        const { data, error } = await supabase
          .from('user_security_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSettings({
            two_factor_enabled: data.two_factor_enabled || false,
            login_notifications: data.login_notifications ?? true,
            session_timeout: data.session_timeout || 480,
            allowed_ip_addresses: data.allowed_ip_addresses || [],
            failed_login_attempts: data.failed_login_attempts || 0,
            account_locked_until: data.account_locked_until || undefined
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar configurações de segurança:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSecuritySettings();
  }, [user]);

  const updateSecuritySettings = async (newSettings: Partial<SecuritySettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('user_security_settings')
        .upsert({
          user_id: user.id,
          two_factor_enabled: updatedSettings.two_factor_enabled,
          login_notifications: updatedSettings.login_notifications,
          session_timeout: updatedSettings.session_timeout,
          allowed_ip_addresses: updatedSettings.allowed_ip_addresses,
          failed_login_attempts: updatedSettings.failed_login_attempts
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Configurações de segurança atualizadas!');
    } catch (error: any) {
      console.error('Erro ao atualizar configurações de segurança:', error);
      toast.error('Erro ao atualizar configurações de segurança');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    updateSecuritySettings
  };
}
