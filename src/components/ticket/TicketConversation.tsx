
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/MessageList";
import { FileUploader } from "@/components/FileUploader";
import { useToast } from "@/hooks/use-toast";
import { Message, Attachment, Ticket } from "@/types";
import { MessageSquare, BrainCircuit } from "lucide-react";

interface TicketConversationProps {
  ticket: Ticket;
  messages: Message[];
  attachments: Attachment[];
  onSendMessage: (content: string, files: File[]) => Promise<void>;
}

const TicketConversation: React.FC<TicketConversationProps> = ({
  ticket,
  messages,
  attachments,
  onSendMessage,
}) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() && newFiles.length === 0) return;

    setIsLoading(true);
    try {
      await onSendMessage(newMessage, newFiles);
      setNewMessage("");
      setNewFiles([]);
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

  return (
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
  );
};

export default TicketConversation;
