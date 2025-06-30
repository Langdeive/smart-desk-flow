
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Smartphone, Monitor } from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  in_app: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  timezone: string;
  language: string;
  onNotificationChange: (key: keyof NotificationSettings, value: boolean) => void;
  onTimezoneChange: (timezone: string) => void;
  onLanguageChange: (language: string) => void;
}

export function NotificationSettings({ 
  settings, 
  timezone, 
  language,
  onNotificationChange, 
  onTimezoneChange,
  onLanguageChange 
}: NotificationSettingsProps) {
  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Notificações e Preferências</CardTitle>
            <CardDescription>
              Configure como você quer receber notificações
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Tipos de Notificação</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Notificações por Email
                </Label>
                <p className="text-sm text-gray-500">
                  Receba emails sobre novos tickets e atualizações
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email}
              onCheckedChange={(checked) => onNotificationChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="push-notifications" className="font-medium">
                  Notificações Push
                </Label>
                <p className="text-sm text-gray-500">
                  Notificações no navegador (quando disponível)
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push}
              onCheckedChange={(checked) => onNotificationChange('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="app-notifications" className="font-medium">
                  Notificações no App
                </Label>
                <p className="text-sm text-gray-500">
                  Alertas dentro da plataforma
                </p>
              </div>
            </div>
            <Switch
              id="app-notifications"
              checked={settings.in_app}
              onCheckedChange={(checked) => onNotificationChange('in_app', checked)}
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <h4 className="font-medium text-gray-900">Preferências Gerais</h4>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={timezone} onValueChange={onTimezoneChange}>
                <SelectTrigger className="force-white-input">
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
                <SelectContent className="force-popover-white">
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                  <SelectItem value="America/Noronha">Fernando de Noronha (GMT-2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="force-white-input">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent className="force-popover-white">
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
