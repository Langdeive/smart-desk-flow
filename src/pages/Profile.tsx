
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { AccountSettingsSection } from "@/components/profile/AccountSettingsSection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

export default function Profile() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>

        <ProfileHeader />

        <div className="grid gap-6 md:grid-cols-1">
          <PersonalInfoSection />
          <AccountSettingsSection />
        </div>
      </div>
    </div>
  );
}
