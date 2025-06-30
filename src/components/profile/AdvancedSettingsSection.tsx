
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Download, Upload, Trash2, Archive, Bell, Eye } from 'lucide-react';

export function AdvancedSettingsSection() {
  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Configurações Avançadas</CardTitle>
            <CardDescription>Opções avançadas de conta e dados</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacidade e Dados */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Privacidade e Dados</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <Label htmlFor="profile-visibility">Perfil visível para outros usuários</Label>
              </div>
              <Switch id="profile-visibility" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="activity-tracking">Permitir rastreamento de atividades</Label>
              </div>
              <Switch id="activity-tracking" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        {/* Exportar e Importar Dados */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Gerenciar Dados</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar Configurações
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Exporte seus dados ou importe configurações de backup
          </p>
        </div>

        <Separator />

        {/* Arquivar e Excluir Conta */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Conta</h4>
          <div className="space-y-3">
            <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
              <Archive className="h-4 w-4" />
              Arquivar Conta Temporariamente
            </Button>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-medium text-red-800 mb-2">Zona de Perigo</h5>
              <p className="text-sm text-red-600 mb-3">
                Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
              </p>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Excluir Conta Permanentemente
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informações do Sistema */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Informações do Sistema</h4>
          <div className="grid gap-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Versão do Sistema:</span>
              <span className="font-mono">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Última Sincronização:</span>
              <span>Há 2 minutos</span>
            </div>
            <div className="flex justify-between">
              <span>Região de Dados:</span>
              <span>São Paulo, Brasil</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
