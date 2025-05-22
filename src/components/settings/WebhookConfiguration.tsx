
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSystemSetting, updateSystemSetting } from "@/services/settingsService";
import { ArrowRightLeft, Save } from "lucide-react";

interface WebhookConfigurationProps {
  companyId: string;
}

const WebhookConfiguration: React.FC<WebhookConfigurationProps> = ({ companyId }) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [enableProcessing, setEnableProcessing] = useState(false);
  const [eventsConfig, setEventsConfig] = useState({
    ticketCreated: true,
    ticketUpdated: true,
    messageCreated: true,
    ticketAssigned: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const [url, enabled, events] = await Promise.all([
          getSystemSetting<string>(companyId, 'n8n_webhook_url'),
          getSystemSetting<boolean>(companyId, 'enable_ai_processing'),
          getSystemSetting<{
            ticketCreated: boolean;
            ticketUpdated: boolean;
            messageCreated: boolean;
            ticketAssigned: boolean;
          }>(companyId, 'events_to_n8n')
        ]);
        
        if (url) setWebhookUrl(url);
        if (enabled !== null && enabled !== undefined) setEnableProcessing(enabled);
        if (events) setEventsConfig(events);
      } catch (err) {
        console.error("Error loading webhook settings:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações do webhook.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (companyId) {
      loadSettings();
    }
  }, [companyId, toast]);
  
  const handleSave = async () => {
    if (!companyId) return;
    
    setIsSaving(true);
    try {
      // Save all settings
      await Promise.all([
        updateSystemSetting(companyId, 'n8n_webhook_url', webhookUrl),
        updateSystemSetting(companyId, 'enable_ai_processing', enableProcessing),
        updateSystemSetting(companyId, 'events_to_n8n', eventsConfig)
      ]);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do webhook foram atualizadas com sucesso."
      });
    } catch (err) {
      console.error("Error saving webhook settings:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações do webhook.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Integração n8n</CardTitle>
        <CardDescription>
          Configure a URL do webhook do n8n e quais eventos devem ser enviados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook do n8n</Label>
          <Input
            id="webhook-url"
            placeholder="https://seu-dominio-n8n.com/webhook/solveflow"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Esta URL receberá todos os eventos configurados abaixo
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enable-processing"
            checked={enableProcessing}
            onCheckedChange={setEnableProcessing}
            disabled={isLoading}
          />
          <Label htmlFor="enable-processing">Ativar Processamento de IA</Label>
        </div>
        
        <div className="space-y-4">
          <Label>Eventos a Enviar</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="ticket-created"
                checked={eventsConfig.ticketCreated}
                onCheckedChange={(checked) => 
                  setEventsConfig(prev => ({ ...prev, ticketCreated: checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="ticket-created">Ticket Criado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ticket-updated"
                checked={eventsConfig.ticketUpdated}
                onCheckedChange={(checked) => 
                  setEventsConfig(prev => ({ ...prev, ticketUpdated: checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="ticket-updated">Ticket Atualizado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="message-created"
                checked={eventsConfig.messageCreated}
                onCheckedChange={(checked) => 
                  setEventsConfig(prev => ({ ...prev, messageCreated: checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="message-created">Mensagem Adicionada</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ticket-assigned"
                checked={eventsConfig.ticketAssigned}
                onCheckedChange={(checked) => 
                  setEventsConfig(prev => ({ ...prev, ticketAssigned: checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="ticket-assigned">Ticket Atribuído</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-semibold flex items-center">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Fluxo de Processamento
          </h4>
          <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
            <li>Portal cria ticket → envia para n8n o eventType: ticket.created</li>
            <li>n8n recebe, realiza a triagem e atualiza o Supabase</li>
            <li>Supabase emite atualização via WebSockets → a interface atualiza</li>
            <li>Quando o ticket é processado, o ciclo continua com novos eventos</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfiguration;
