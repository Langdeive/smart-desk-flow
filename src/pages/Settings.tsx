
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getN8nSettings, saveN8nSettings, N8nSettings } from "@/services/settingsService";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [n8nSettings, setN8nSettings] = useState<N8nSettings>({
    webhookUrl: "",
    enableProcessing: true,
    events: {
      ticketCreated: true,
      ticketUpdated: true,
      messageCreated: true,
      ticketAssigned: true
    }
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
    
    toast({
      title: checked ? "Tema escuro ativado" : "Tema claro ativado",
      description: `Você mudou para o tema ${checked ? 'escuro' : 'claro'}.`
    });
  };

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.appMetadata?.company_id) {
        console.error("Company ID not found in user metadata");
        return;
      }
      
      try {
        const settings = await getN8nSettings(user.appMetadata.company_id);
        setN8nSettings(settings);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar suas configurações.",
          variant: "destructive",
        });
      }
    };
    
    if (user) {
      loadSettings();
    }
  }, [user, toast]);

  const handleSaveSettings = async () => {
    if (!user?.appMetadata?.company_id) {
      toast({
        title: "Erro ao salvar",
        description: "ID da empresa não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await saveN8nSettings(user.appMetadata.company_id, n8nSettings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "Suas configurações de integração foram atualizadas com sucesso.",
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para testar o webhook
  const testN8nWebhook = async () => {
    if (!n8nSettings.webhookUrl) {
      toast({
        title: "URL não definida",
        description: "Por favor, insira a URL do webhook n8n antes de testar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      // Enviar um payload de teste para o webhook
      const response = await fetch(n8nSettings.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "test.connection",
          timestamp: new Date().toISOString(),
          source: "helpdesk-settings"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      
      toast({
        title: "Conexão bem-sucedida",
        description: "O webhook do n8n está configurado corretamente.",
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Falha na conexão",
        description: `Não foi possível conectar ao webhook. ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Update webhook URL
  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setN8nSettings(prev => ({
      ...prev,
      webhookUrl: e.target.value
    }));
  };

  // Update processing enabled
  const handleProcessingEnabledChange = (checked: boolean) => {
    setN8nSettings(prev => ({
      ...prev,
      enableProcessing: checked
    }));
  };

  // Update event settings
  const handleEventChange = (event: keyof N8nSettings['events'], checked: boolean) => {
    setN8nSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: checked
      }
    }));
  };

  // Modify the General tab content
  const renderGeneralTab = () => (
    <TabsContent value="general">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as opções básicas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle">Tema Escuro</Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema de helpdesk
          </p>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="mb-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
        </TabsList>
        
        {renderGeneralTab()}
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integração com n8n</CardTitle>
              <CardDescription>
                Configure a integração com n8n para processamento automático de tickets e automações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="n8nWebhookUrl">URL do Webhook n8n</Label>
                <Input
                  id="n8nWebhookUrl"
                  value={n8nSettings.webhookUrl}
                  onChange={handleWebhookUrlChange}
                  placeholder="https://seu-servidor-n8n.com/webhook/endpoint"
                />
                <p className="text-sm text-muted-foreground">
                  Insira a URL do webhook criado no n8n para receber eventos de tickets.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAiProcessing"
                  checked={n8nSettings.enableProcessing}
                  onCheckedChange={handleProcessingEnabledChange}
                />
                <Label htmlFor="enableAiProcessing">Ativar processamento automático via n8n</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Eventos Enviados para n8n</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="event-ticket-created" 
                      checked={n8nSettings.events.ticketCreated}
                      onCheckedChange={(checked) => handleEventChange('ticketCreated', checked)}
                    />
                    <Label htmlFor="event-ticket-created">Ticket Criado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="event-ticket-updated"
                      checked={n8nSettings.events.ticketUpdated}
                      onCheckedChange={(checked) => handleEventChange('ticketUpdated', checked)}
                    />
                    <Label htmlFor="event-ticket-updated">Ticket Atualizado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="event-message-created"
                      checked={n8nSettings.events.messageCreated}
                      onCheckedChange={(checked) => handleEventChange('messageCreated', checked)}
                    />
                    <Label htmlFor="event-message-created">Nova Mensagem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="event-ticket-assigned"
                      checked={n8nSettings.events.ticketAssigned}
                      onCheckedChange={(checked) => handleEventChange('ticketAssigned', checked)}
                    />
                    <Label htmlFor="event-ticket-assigned">Ticket Atribuído</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button 
                onClick={testN8nWebhook} 
                variant="outline"
                disabled={isTesting || !n8nSettings.webhookUrl}
              >
                {isTesting ? "Testando..." : "Testar Conexão"}
              </Button>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando notificações serão enviadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As configurações de notificações serão implementadas em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
              <CardDescription>
                Configure o comportamento da inteligência artificial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As configurações de IA serão implementadas em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
