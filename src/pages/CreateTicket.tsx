
import React from "react";
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
import { TicketCategory } from "@/types";

const ticketFormSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
  category: z.enum(["technical_issue", "feature_request", "billing", "general_inquiry", "other"]),
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
  name: z.string().min(2, { message: "Por favor, insira seu nome" }),
  company: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const categoryLabels: Record<TicketCategory, string> = {
  technical_issue: "Problema Técnico",
  feature_request: "Solicitação de Recurso",
  billing: "Faturamento",
  general_inquiry: "Dúvida Geral",
  other: "Outro",
};

const CreateTicket = () => {
  const { toast } = useToast();
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical_issue",
      email: "",
      name: "",
      company: "",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    try {
      // Aqui precisaremos implementar a integração com o Supabase para salvar o ticket
      console.log("Dados do formulário:", data);
      console.log("Arquivos anexados:", files);
      
      toast({
        title: "Ticket criado com sucesso",
        description: "Você receberá atualizações sobre o seu chamado por e-mail.",
      });
      
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      toast({
        title: "Erro ao criar ticket",
        description: "Ocorreu um erro ao enviar seu chamado. Por favor, tente novamente.",
        variant: "destructive",
      });
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                <Button type="submit" className="w-full">
                  Enviar Chamado
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
