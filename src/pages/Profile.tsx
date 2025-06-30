
import React from 'react';
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { ProfessionalInfoSection } from "@/components/profile/ProfessionalInfoSection";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
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
          <PersonalInfoSection />
          
          <ProfessionalInfoSection 
            department={preferences.department}
            onDepartmentChange={updateDepartment}
          />
          
          <NotificationSettings 
            settings={preferences.notifications}
            timezone={preferences.timezone}
            language={preferences.language}
            onNotificationChange={updateNotification}
            onTimezoneChange={updateTimezone}
            onLanguageChange={updateLanguage}
          />
          
          <AccountSettingsSection />
        </div>
      </div>
    </div>
  );
}
