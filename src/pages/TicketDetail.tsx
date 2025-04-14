
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/FileUploader";
import { MessageList } from "@/components/MessageList";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Message, Attachment, TicketStatus, TicketPriority } from "@/types";
import { ArrowLeft, MoreVertical, PenBox, MessageSquare, Paperclip, BrainCircuit } from "lucide-react";

// Dados mockados para demonstração - serão substituídos pela integração com Supabase
const getMockTicket = (): Ticket => {
  return {
    id: "2",
    title: "Solicitação de novo recurso",
    description: "Gostaria de sugerir a adição de um novo recurso que permitiria aos usuários exportar relatórios em formato PDF ou Excel.",
    status: "in_progress",
    priority: "medium",
    category: "feature_request",
    userId: "user2",
    agentId: "agent1",
    companyId: "company1",
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    source: "email",
    aiProcessed: true,
    needsHumanReview: true,
  };
};

const getMockMessages = (): Message[] => {
  return [
    {
      id: "1",
      content: "Gostaria de sugerir a adição de um novo recurso que permitiria aos usuários exportar relatórios em formato PDF ou Excel.",
      ticketId: "2",
      userId: "user2",
      createdAt: new Date(Date.now() - 172800000),
      isFromClient: true,
      isAutomatic: false,
    },
    {
      id: "2",
      content: "Olá! Obrigado por sua sugestão. Vou analisar a viabilidade deste recurso junto à nossa equipe de produto. Poderia me informar em quais situações você utilizaria esta funcionalidade?",
      ticketId: "2",
      userId: "ai",
      createdAt: new Date(Date.now() - 170800000),
      isFromClient: false,
      isAutomatic: true,
    },
    {
      id: "3",
      content: "Eu preciso gerar relatórios mensais para minha equipe e atualmente preciso copiar e colar os dados manualmente para o Excel. Seria muito útil poder exportar diretamente.",
      ticketId: "2",
      userId: "user2",
      createdAt: new Date(Date.now() - 169000000),
      isFromClient: true,
      isAutomatic: false,
    },
    {
      id: "4",
      content: "Entendi! Esta informação é muito valiosa. Estou encaminhando sua solicitação para nosso time de desenvolvimento para avaliação. Assim que tivermos uma atualização sobre a implementação deste recurso, entraremos em contato.",
      ticketId: "2",
      userId: "agent1",
      createdAt: new Date(Date.now() - 86400000),
      isFromClient: false,
      isAutomatic: false,
    },
  ];
};

const getMockAttachments = (): Attachment[] => {
  return [
    {
      id: "1",
      fileName: "exemplo_relatorio.png",
      fileType: "image/png",
      fileSize: 250000,
      fileUrl: "https://example.com/exemplo_relatorio.png",
      ticketId: "2",
      messageId: "1",
      createdAt: new Date(Date.now() - 172800000),
    },
  ];
};

const statusColors: Record<TicketStatus, string> = {
  new: "bg-blue-500",
  waiting_for_client: "bg-yellow-500",
  waiting_for_agent: "bg-purple-500",
  in_progress: "bg-orange-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const statusLabels: Record<TicketStatus, string> = {
  new: "Novo",
  waiting_for_client: "Aguardando Cliente",
  waiting_for_agent: "Aguardando Agente",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const TicketDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket>(getMockTicket());
  const [messages, setMessages] = useState<Message[]>(getMockMessages());
  const [attachments, setAttachments] = useState<Attachment[]>(getMockAttachments());
  const [newMessage, setNewMessage] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleStatusChange = (status: string) => {
    setTicket(prev => ({ ...prev, status: status as TicketStatus }));
    // Aqui iria a lógica para atualizar o status no banco de dados
    toast({
      title: "Status atualizado",
      description: `O status foi alterado para ${statusLabels[status as TicketStatus]}.`,
    });
  };

  const handlePriorityChange = (priority: string) => {
    setTicket(prev => ({ ...prev, priority: priority as TicketPriority }));
    // Aqui iria a lógica para atualizar a prioridade no banco de dados
    toast({
      title: "Prioridade atualizada",
      description: `A prioridade foi alterada para ${priorityLabels[priority as TicketPriority]}.`,
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && newFiles.length === 0) return;

    setIsLoading(true);
    try {
      // Simulando o envio da mensagem
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        content: newMessage,
        ticketId: ticket.id,
        userId: "agent1", // No sistema real, seria o ID do usuário logado
        createdAt: new Date(),
        isFromClient: false,
        isAutomatic: false,
      };

      // Simulando o upload de arquivos
      const newAttachments: Attachment[] = newFiles.map(file => ({
        id: `attachment-${Date.now()}-${file.name}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file), // No sistema real, seria a URL do arquivo no storage
        ticketId: ticket.id,
        messageId: newMsg.id,
        createdAt: new Date(),
      }));

      setMessages(prev => [...prev, newMsg]);
      setAttachments(prev => [...prev, ...newAttachments]);
      setNewMessage("");
      setNewFiles([]);

      toast({
        title: "Mensagem enviada",
        description: "Sua resposta foi enviada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua resposta. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiSuggestion = () => {
    setIsLoading(true);
    
    // Simulação da resposta da IA
    setTimeout(() => {
      const aiSuggestion = "Com base nas informações fornecidas pelo cliente, sugiro informar que estamos avaliando a implementação do recurso de exportação de relatórios para a próxima atualização. Peça mais detalhes sobre os tipos de dados que ele precisa incluir nos relatórios para ajudarmos a priorizar esta funcionalidade.";
      
      setNewMessage(aiSuggestion);
      setIsLoading(false);
      
      toast({
        title: "Sugestão da IA",
        description: "Uma resposta foi gerada com base no histórico do ticket.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Tickets
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              #{ticket.id}{" "}
              <Badge
                variant="outline"
                className={`${statusColors[ticket.status]} text-white`}
              >
                {statusLabels[ticket.status]}
              </Badge>
            </h1>
            <p className="text-lg font-medium">{ticket.title}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PenBox className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Conversa</CardTitle>
              <CardDescription>
                Histórico de comunicação com o cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessageList 
                messages={messages} 
                attachments={attachments} 
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full">
                <Textarea
                  placeholder="Digite sua resposta..."
                  className="min-h-[120px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              
              <FileUploader
                files={newFiles}
                setFiles={setNewFiles}
                maxFiles={3}
              />
              
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={handleAiSuggestion}
                  disabled={isLoading}
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Sugerir Resposta
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!newMessage.trim() && newFiles.length === 0)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar Resposta
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Select defaultValue={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
                <Select defaultValue={ticket.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <p className="mt-1">Solicitação de Recurso</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fonte</p>
                <Badge variant="secondary" className="mt-1">
                  {ticket.source.charAt(0).toUpperCase() + ticket.source.slice(1)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                <p className="mt-1">{formatDate(ticket.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                <p className="mt-1">{formatDate(ticket.updatedAt)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p className="mt-1">João Silva</p>
                <p className="text-sm text-muted-foreground">joao.silva@example.com</p>
                <p className="text-sm text-muted-foreground">Empresa ABC</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atendente</p>
                <p className="mt-1">Maria Oliveira</p>
                <p className="text-sm text-muted-foreground">maria@suporte.com</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Anexos</CardTitle>
            </CardHeader>
            <CardContent>
              {attachments.length === 0 ? (
                <p className="text-muted-foreground">Nenhum anexo disponível</p>
              ) : (
                <ul className="space-y-2">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate"
                      >
                        {attachment.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Análise da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Sentimento</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Positivo
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Sugestão</p>
                  <p className="text-sm text-muted-foreground">
                    O cliente está interessado em um novo recurso. Prioridade sugerida: média.
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Artigos Relacionados</p>
                  <ul className="text-sm space-y-1 mt-1">
                    <li>
                      <a href="#" className="text-blue-500 hover:underline">
                        Como exportar relatórios
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-500 hover:underline">
                        Solicitação de novos recursos
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Reanalisar com IA
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
