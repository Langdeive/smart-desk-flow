
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
import { supabase } from "@/integrations/supabase/client";
import GlobalSettingsPanel from "@/components/settings/GlobalSettingsPanel";
import ConfigurationIndicator from "@/components/settings/ConfigurationIndicator";
import N8nIntegrationMonitoring from "@/components/settings/N8nIntegrationMonitoring";

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
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  // Check if user is a developer
  const isDeveloper = user?.app_metadata?.role === 'developer';

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
    
    toast({
      title: checked ? "Tema escuro ativado" : "Tema claro ativado",
      description: `Você mudou para o tema ${checked ? 'escuro' : 'claro'}.`
    });
  };

  // Get company ID with fallback
  const getCompanyId = async (): Promise<string | null> => {
    // First try to get from user metadata
    const metadataCompanyId = user?.app_metadata?.company_id;
    if (metadataCompanyId) {
      console.log("Company ID found in metadata:", metadataCompanyId);
      return metadataCompanyId;
    }

    // Fallback: get from user_companies table
    if (user?.id) {
      console.log("Company ID not in metadata, fetching from user_companies for user:", user.id);
      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching company from user_companies:", error);
          return null;
        }
        
        if (data?.company_id) {
          console.log("Company ID found in user_companies:", data.company_id);
          return data.company_id;
        }
      } catch (err) {
        console.error("Exception fetching company ID:", err);
      }
    }

    console.error("Company ID not found in metadata or user_companies table");
    return null;
  };

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        console.log("No user found, skipping settings load");
        return;
      }
      
      try {
        const resolvedCompanyId = await getCompanyId();
        setCompanyId(resolvedCompanyId);
        
        if (!resolvedCompanyId) {
          console.error("Cannot load settings: Company ID not found");
          toast({
            title: "Erro ao carregar configurações",
            description: "ID da empresa não encontrado. Entre em contato com o suporte.",
            variant: "destructive",
          });
          return;
        }
        
        const settings = await getN8nSettings(resolvedCompanyId);
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
    
    loadSettings();
  }, [user, toast]);

  const handleSaveSettings = async () => {
    if (!user) {
      toast({
        title: "Erro ao salvar",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    // Get company ID with fallback
    const resolvedCompanyId = companyId || await getCompanyId();
    
    if (!resolvedCompanyId) {
      toast({
        title: "Erro ao salvar",
        description: "ID da empresa não encontrado. Verifique se você está associado a uma empresa.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      console.log("Saving settings for company:", resolvedCompanyId);
      const success = await saveN8nSettings(resolvedCompanyId, n8nSettings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "Suas configurações de integração foram atualizadas com sucesso. As integrações agora são processadas automaticamente pelo backend.",
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
        description: "O webhook do n8n está configurado corretamente e será usado automaticamente pelo backend.",
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
          {isDeveloper && <TabsTrigger value="global">Global</TabsTrigger>}
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
        </TabsList>
        
        {renderGeneralTab()}
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Integração com n8n
                {companyId && (
                  <div className="flex gap-2">
                    <ConfigurationIndicator
                      companyId={companyId}
                      settingKey="n8n_webhook_url"
                      label="Webhook URL"
                    />
                    <ConfigurationIndicator
                      companyId={companyId}
                      settingKey="enable_ai_processing"
                      label="Processamento IA"
                    />
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Configure a integração com n8n para processamento automático de tickets. 
                As integrações são processadas automaticamente pelo backend via triggers do banco de dados.
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
                  Insira a URL do webhook criado no n8n para receber eventos de tickets automaticamente.
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
                <Label>Eventos Enviados para n8n (Automático)</Label>
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
                <p className="text-sm text-muted-foreground">
                  Os eventos são enviados automaticamente pelo backend quando ocorrem alterações nos dados.
                </p>
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
                disabled={isSaving || !companyId}
              >
                {isSaving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {isDeveloper && (
          <TabsContent value="global">
            <GlobalSettingsPanel />
          </TabsContent>
        )}

        <TabsContent value="monitoring">
          <N8nIntegrationMonitoring />
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
