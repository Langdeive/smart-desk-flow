
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketCategory, TicketPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface TicketBasicInfoProps {
  form: UseFormReturn<any>;
  characterCount: number;
}

export const TicketBasicInfo: React.FC<TicketBasicInfoProps> = ({ form, characterCount }) => {
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

  return (
    <div className="space-y-6 mb-6">
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
              <div className="relative">
                <Textarea 
                  placeholder="Descreva em detalhes o seu problema ou solicitação. Quanto mais informações, mais rápido poderemos te ajudar."
                  className="min-h-[150px] resize-y"
                  {...field} 
                />
                <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {characterCount}/2000
                </span>
              </div>
            </FormControl>
            <FormDescription>
              Inclua passos para reproduzir o problema, mensagens de erro, e qualquer outra informação relevante.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Categoria</FormLabel>
                <Badge variant="outline" className="text-xs font-normal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA pode classificar
                </Badge>
              </div>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <div className="flex items-center gap-2">
                <FormLabel>Prioridade</FormLabel>
                <Badge variant="outline" className="text-xs font-normal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA pode sugerir
                </Badge>
              </div>
              <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  );
};
