
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TicketCategory, TicketPriority } from "@/types";
import { useTicketCreation, TicketFormData } from "@/hooks/useTicketCreation";
import { TicketFormHeader } from "@/components/ticket/TicketFormHeader";
import { ClientContactSection } from "@/components/ticket/ClientContactSection";
import { TicketBasicInfo } from "@/components/ticket/TicketBasicInfo";
import { TicketAdvancedFields } from "@/components/ticket/TicketAdvancedFields";
import { FileUploader } from "@/components/FileUploader";
import { useAgents } from "@/hooks/useAgents";
import { useAuth } from "@/hooks/useAuth";

const ticketFormSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }).max(2000, { message: "A descrição não pode ter mais de 2000 caracteres" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }), // Alterado para aceitar qualquer string
  priority: z.enum(["low", "medium", "high", "critical"]),
  clientId: z.string().min(1, { message: "Selecione um cliente" }),
  contactId: z.string().optional(),
  name: z.string().min(2, { message: "Por favor, insira seu nome" }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
  agentId: z.string().optional(),
  tags: z.string().optional(),
  source: z.string().optional()
});

// Create a type that matches our zod schema
type TicketFormValues = z.infer<typeof ticketFormSchema>;

const CreateTicket = () => {
  const {
    isAgent,
    user,
    clients,
    contacts,
    clientsLoading,
    contactsLoading,
    selectedClientId,
    files,
    setFiles,
    isSubmitting,
    handleClientChange,
    handleContactChange,
    handleCreateContact,
    submitTicket,
    getSLAText,
  } = useTicketCreation();

  // DEBUG: Add direct auth hook to double-check role information 
  const { role: directRole } = useAuth();
  
  // DEBUG: Add console logs to help debug the issue
  console.log("DEBUG CreateTicket - Direct role from useAuth:", directRole);
  console.log("DEBUG CreateTicket - isAgent from useTicketCreation:", isAgent);
  console.log("DEBUG CreateTicket - User data:", user);

  const [characterCount, setCharacterCount] = useState(0);
  const { agents } = useAgents(user?.app_metadata?.company_id || "");
  
  const defaultValues: TicketFormValues = {
    title: "",
    description: "",
    category: "technical_issue", // Valor padrão como string
    priority: "medium" as TicketPriority,
    clientId: isAgent ? "" : (user?.id || ""),
    contactId: "",
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    agentId: "",
    tags: "",
    source: "Portal Web"
  };

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
  });

  // Update character count when description changes
  useEffect(() => {
    const descriptionValue = form.watch("description");
    setCharacterCount(descriptionValue?.length || 0);
  }, [form.watch("description")]);

  // DEBUG: Log whenever key form properties change
  useEffect(() => {
    console.log("DEBUG CreateTicket - Form client ID:", form.getValues("clientId"));
    console.log("DEBUG CreateTicket - Form contact ID:", form.getValues("contactId"));
  }, [form.watch("clientId"), form.watch("contactId")]);

  const onSubmit = async (data: TicketFormValues) => {
    await submitTicket(data);
  };
  
  const handleNewContactCreate = async (contactData: { name: string; email: string; clientId: string }) => {
    const newContact = await handleCreateContact(contactData);
    if (newContact) {
      // Set the form values with the newly created contact
      form.setValue("contactId", newContact.id);
      form.setValue("name", newContact.name || "");
      form.setValue("email", newContact.email || "");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Header with SLA Badge */}
              <TicketFormHeader 
                slaText={getSLAText(form.watch("priority") as TicketPriority)} 
                priority={form.watch("priority") as TicketPriority}
              />
              
              {/* Cliente & Contato Section */}
              <ClientContactSection 
                isAgent={isAgent}
                form={form}
                clients={clients}
                contacts={contacts}
                clientsLoading={clientsLoading}
                contactsLoading={contactsLoading}
                handleClientChange={handleClientChange}
                handleContactChange={handleContactChange}
                onCreateContact={handleNewContactCreate}
              />
              
              {/* Basic Ticket Info */}
              <TicketBasicInfo form={form} characterCount={characterCount} />
              
              {/* Attachments Section */}
              <div className="mb-6">
                <h2 className="text-base font-medium mb-2">Anexos</h2>
                <FileUploader 
                  files={files}
                  setFiles={setFiles}
                  maxFiles={5}
                  maxSize={25 * 1024 * 1024} // 25MB
                />
              </div>
              
              {/* Advanced Fields in Accordion */}
              {isAgent && <TicketAdvancedFields form={form} agents={agents} />}
              
              {/* Submit Button */}
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
