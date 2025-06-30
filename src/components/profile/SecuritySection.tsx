
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSecuritySettings } from '@/hooks/useUserSecuritySettings';
import { Shield, Smartphone, Bell, Clock, Lock, AlertTriangle } from 'lucide-react';

export function SecuritySection() {
  const { settings, isLoading, isSaving, updateSecuritySettings } = useUserSecuritySettings();

  if (isLoading) {
    return (
      <Card className="force-white-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-turquoise-vibrant" />
            <div>
              <CardTitle className="text-xl">Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Configurações de Segurança</CardTitle>
            <CardDescription>Gerencie a segurança da sua conta</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {/* Autenticação de Dois Fatores */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="two-factor" className="text-base font-medium">
                  Autenticação de Dois Fatores
                </Label>
                <p className="text-sm text-gray-500">
                  Adicione uma camada extra de segurança à sua conta
                </p>
              </div>
            </div>
            <Switch
              id="two-factor"
              checked={settings.two_factor_enabled}
              onCheckedChange={(checked) => 
                updateSecuritySettings({ two_factor_enabled: checked })
              }
              disabled={isSaving}
            />
          </div>

          {/* Notificações de Login */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-green-600" />
              <div>
                <Label htmlFor="login-notifications" className="text-base font-medium">
                  Notificações de Login
                </Label>
                <p className="text-sm text-gray-500">
                  Receba alertas quando alguém acessar sua conta
                </p>
              </div>
            </div>
            <Switch
              id="login-notifications"
              checked={settings.login_notifications}
              onCheckedChange={(checked) => 
                updateSecuritySettings({ login_notifications: checked })
              }
              disabled={isSaving}
            />
          </div>

          {/* Timeout da Sessão */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <Label htmlFor="session-timeout" className="text-base font-medium">
                  Tempo Limite da Sessão
                </Label>
                <p className="text-sm text-gray-500">
                  Tempo em minutos antes de fazer logout automático
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="session-timeout"
                type="number"
                min="30"
                max="1440"
                value={settings.session_timeout}
                onChange={(e) => 
                  updateSecuritySettings({ session_timeout: parseInt(e.target.value) || 480 })
                }
                className="w-32"
              />
              <span className="text-sm text-gray-500">minutos</span>
            </div>
          </div>

          {/* Status de Segurança */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium">Status de Segurança</Label>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tentativas de login falhadas:</span>
                <span className={`font-medium ${settings.failed_login_attempts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {settings.failed_login_attempts}
                </span>
              </div>
              {settings.account_locked_until && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Conta temporariamente bloqueada</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações de Segurança */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" disabled={isSaving}>
              Alterar Senha
            </Button>
            <Button variant="outline" size="sm" disabled={isSaving}>
              Gerar Códigos de Recuperação
            </Button>
            <Button variant="outline" size="sm" disabled={isSaving}>
              Revisar Dispositivos Conectados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
