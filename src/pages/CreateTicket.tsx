
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/FileUploader";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { TicketCategory, TicketPriority, Client } from "@/types";
import { createTicket, uploadAttachment } from "@/services/ticketService";
import { useClients } from "@/hooks/useClients";
import { Loader2 } from "lucide-react";
import { useClientContacts } from "@/hooks/useClientContacts";

const ticketFormSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
  category: z.enum(["technical_issue", "feature_request", "billing", "general_inquiry", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  clientId: z.string().min(1, { message: "Selecione um cliente" }),
  contactId: z.string().optional(),
  name: z.string().min(2, { message: "Por favor, insira seu nome" }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const categoryLabels: Record<TicketCategory, string> = {
  technical_issue: "Problema Técnico",
  feature_request: "Solicitação de Recurso",
  billing: "Faturamento",
  general_inquiry: "Dúvida Geral",
  other: "Outro",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const CreateTicket = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { clients, isLoading: clientsLoading } = useClients();
  const { contacts, isLoading: contactsLoading } = useClientContacts(selectedClientId || undefined);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical_issue",
      priority: "medium",
      clientId: "",
      contactId: "",
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create the ticket
      const ticket = await createTicket({
        title: data.title,
        description: data.description,
        status: "new",
        priority: data.priority,
        category: data.category,
        userId: data.clientId,
        companyId: "00000000-0000-0000-0000-000000000000", // This would be the current company ID in a real app
        source: "web",
        contactId: data.contactId
      });
      
      // Upload any attachments
      if (files.length > 0) {
        toast({
          title: "Enviando anexos",
          description: "Aguarde enquanto enviamos seus arquivos...",
        });
        
        await Promise.all(
          files.map(file => uploadAttachment(file, ticket.id))
        );
      }
      
      toast({
        title: "Ticket criado com sucesso",
        description: "Você receberá atualizações sobre o seu chamado por e-mail.",
      });
      
      // Redirect to ticket details
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast({
        title: "Erro ao criar ticket",
        description: "Ocorreu um erro ao enviar seu chamado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to handle client selection and auto-fill
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue("clientId", clientId);
    form.setValue("contactId", ""); // Reset contact if client changes
    
    // Clear previous contact data
    form.setValue("name", "");
    form.setValue("email", "");
  };

  // Helper function to handle contact selection
  const handleContactChange = (contactId: string) => {
    form.setValue("contactId", contactId);
    
    // Auto-fill contact details
    const selectedContact = contacts?.find(contact => contact.id === contactId);
    if (selectedContact) {
      if (selectedContact.name) {
        form.setValue("name", selectedContact.name);
      }
      if (selectedContact.email) {
        form.setValue("email", selectedContact.email);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Abrir Novo Chamado</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo com os detalhes da sua solicitação.
            Nosso sistema analisará automaticamente seu chamado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select 
                        onValueChange={handleClientChange} 
                        value={field.value}
                        disabled={clientsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientsLoading ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Carregando clientes...</span>
                            </div>
                          ) : (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedClientId && (
                  <FormField
                    control={form.control}
                    name="contactId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato</FormLabel>
                        <Select 
                          onValueChange={handleContactChange} 
                          value={field.value}
                          disabled={contactsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um contato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactsLoading ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Carregando contatos...</span>
                              </div>
                            ) : contacts && contacts.length > 0 ? (
                              contacts.map((contact) => (
                                <SelectItem key={contact.id} value={contact.id}>
                                  {contact.name || contact.email || contact.phone || "Sem nome"}
                                  {contact.is_primary && " (Principal)"}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-muted-foreground">
                                Nenhum contato encontrado
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione um contato ou preencha os dados manualmente abaixo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do contato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="E-mail do contato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(priorityLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Chamado</FormLabel>
                    <FormControl>
                      <Input placeholder="Resumo do seu problema ou solicitação" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva em detalhes o seu problema ou solicitação. Quanto mais informações, mais rápido poderemos te ajudar."
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Inclua passos para reproduzir o problema, mensagens de erro, e qualquer outra informação relevante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Anexos</FormLabel>
                <FileUploader files={files} setFiles={setFiles} />
                <FormDescription>
                  Você pode enviar capturas de tela, logs ou qualquer arquivo relevante para o seu chamado.
                </FormDescription>
              </div>
              
              <CardFooter className="px-0 pt-6">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Chamado"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
