
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  getGlobalN8nSettings, 
  saveGlobalN8nSettings, 
  N8nSettings 
} from "@/services/settingsService";
import { Globe, Save, AlertTriangle } from "lucide-react";

const GlobalSettingsPanel: React.FC = () => {
  const [globalSettings, setGlobalSettings] = useState<N8nSettings>({
    webhookUrl: "",
    enableProcessing: false,
    events: {
      ticketCreated: true,
      ticketUpdated: true,
      messageCreated: true,
      ticketAssigned: true
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadGlobalSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await getGlobalN8nSettings();
        setGlobalSettings(settings);
      } catch (error) {
        console.error("Error loading global settings:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações globais.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGlobalSettings();
  }, [toast]);
  
  const handleSaveGlobalSettings = async () => {
    setIsSaving(true);
    try {
      const success = await saveGlobalN8nSettings(globalSettings);
      
      if (success) {
        toast({
          title: "Configurações globais salvas",
          description: "As configurações globais foram atualizadas com sucesso.",
        });
      } else {
        throw new Error("Failed to save global settings");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações globais:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações globais.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configurações Globais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Configurações Globais
          <Badge variant="secondary">Developer Only</Badge>
        </CardTitle>
        <CardDescription>
          Configurações padrão que serão usadas quando uma empresa não possui configurações específicas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Estas configurações afetam todas as empresas que não possuem configurações específicas.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="global-webhook-url">URL do Webhook n8n Global</Label>
          <Input
            id="global-webhook-url"
            placeholder="https://seu-servidor-n8n.com/webhook/endpoint"
            value={globalSettings.webhookUrl}
            onChange={(e) => setGlobalSettings(prev => ({
              ...prev,
              webhookUrl: e.target.value
            }))}
          />
          <p className="text-sm text-muted-foreground">
            URL padrão para processamento de tickets via n8n.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="global-enable-processing"
            checked={globalSettings.enableProcessing}
            onCheckedChange={(checked) => setGlobalSettings(prev => ({
              ...prev,
              enableProcessing: checked
            }))}
          />
          <Label htmlFor="global-enable-processing">Ativar Processamento Global de IA</Label>
        </div>
        
        <div className="space-y-4">
          <Label>Eventos Globais Enviados para n8n</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="global-event-ticket-created" 
                checked={globalSettings.events.ticketCreated}
                onCheckedChange={(checked) => setGlobalSettings(prev => ({
                  ...prev,
                  events: { ...prev.events, ticketCreated: checked }
                }))}
              />
              <Label htmlFor="global-event-ticket-created">Ticket Criado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="global-event-ticket-updated"
                checked={globalSettings.events.ticketUpdated}
                onCheckedChange={(checked) => setGlobalSettings(prev => ({
                  ...prev,
                  events: { ...prev.events, ticketUpdated: checked }
                }))}
              />
              <Label htmlFor="global-event-ticket-updated">Ticket Atualizado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="global-event-message-created"
                checked={globalSettings.events.messageCreated}
                onCheckedChange={(checked) => setGlobalSettings(prev => ({
                  ...prev,
                  events: { ...prev.events, messageCreated: checked }
                }))}
              />
              <Label htmlFor="global-event-message-created">Nova Mensagem</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="global-event-ticket-assigned"
                checked={globalSettings.events.ticketAssigned}
                onCheckedChange={(checked) => setGlobalSettings(prev => ({
                  ...prev,
                  events: { ...prev.events, ticketAssigned: checked }
                }))}
              />
              <Label htmlFor="global-event-ticket-assigned">Ticket Atribuído</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveGlobalSettings} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações Globais
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalSettingsPanel;
