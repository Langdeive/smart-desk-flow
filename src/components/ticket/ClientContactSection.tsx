
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ClientContactSectionProps {
  isAgent: boolean;
  form: UseFormReturn<any>;
  clients: any[];
  contacts: any[] | undefined;
  clientsLoading: boolean;
  contactsLoading: boolean;
  handleClientChange: (clientId: string) => string;
  handleContactChange: (contactId: string, contacts: any[]) => { 
    contactId: string; 
    contactName: string; 
    contactEmail: string; 
  };
}

export const ClientContactSection: React.FC<ClientContactSectionProps> = ({
  isAgent,
  form,
  clients,
  contacts,
  clientsLoading,
  contactsLoading,
  handleClientChange,
  handleContactChange,
}) => {
  if (!isAgent) {
    // Para clientes, não mostrar seleção de cliente, apenas informações de contato
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
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
                <Input placeholder="Seu e-mail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }
  
  // Para agentes, mostrar seleção completa de cliente e contato
  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const clientId = handleClientChange(value);
                  form.setValue("clientId", clientId);
                  form.setValue("contactId", "");
                  form.setValue("name", "");
                  form.setValue("email", "");
                }} 
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
      </div>

      {form.watch("clientId") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    const contactInfo = handleContactChange(value, contacts || []);
                    form.setValue("contactId", contactInfo.contactId);
                    form.setValue("name", contactInfo.contactName);
                    form.setValue("email", contactInfo.contactEmail);
                  }} 
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
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>
      )}
      
      {form.watch("clientId") && (
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
      )}
    </div>
  );
};
