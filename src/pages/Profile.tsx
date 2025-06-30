
import React from 'react';
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { ProfessionalInfoSection } from "@/components/profile/ProfessionalInfoSection";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { RoleStatisticsSection } from "@/components/profile/RoleStatisticsSection";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { ActivityLogSection } from "@/components/profile/ActivityLogSection";
import { AdvancedSettingsSection } from "@/components/profile/AdvancedSettingsSection";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { 
    preferences, 
    isLoading, 
    updateAvatar, 
    updateDepartment, 
    updateNotification, 
    updateTimezone, 
    updateLanguage 
  } = useUserPreferences();

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas informações pessoais e configurações de conta
            </p>
          </div>
          
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>

        <ProfileHeader 
          avatarUrl={preferences.avatar_url}
          onAvatarUpdate={updateAvatar}
        />

        <div className="grid gap-6">
          {/* Fase 1 - Informações Básicas */}
          <PersonalInfoSection />
          
          {/* Fase 2 - Informações Profissionais */}
          <ProfessionalInfoSection 
            department={preferences.department}
            onDepartmentChange={updateDepartment}
          />

          {/* Fase 3 - Estatísticas por Role */}
          <RoleStatisticsSection />
          
          {/* Fase 2 - Configurações de Notificação */}
          <NotificationSettings 
            settings={preferences.notifications}
            timezone={preferences.timezone}
            language={preferences.language}
            onNotificationChange={updateNotification}
            onTimezoneChange={updateTimezone}
            onLanguageChange={updateLanguage}
          />

          {/* Fase 3 - Seção de Segurança */}
          <SecuritySection />

          {/* Fase 3 - Log de Atividades */}
          <ActivityLogSection />
          
          {/* Fase 1 - Configurações da Conta */}
          <AccountSettingsSection />

          {/* Fase 3 - Configurações Avançadas */}
          <AdvancedSettingsSection />
        </div>
      </div>
    </div>
  );
}
