
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageList } from "@/components/MessageList";
import { FileUploader } from "@/components/FileUploader";
import { useToast } from "@/hooks/use-toast";
import { Message, Attachment, Ticket } from "@/types";
import { MessageSquare, BrainCircuit, Loader2 } from "lucide-react";
import { reprocessTicket } from "@/services/aiProcessingService";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestAIAnalysis = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const success = await reprocessTicket(ticket.id);
      
      if (success) {
        toast({
          title: "Análise solicitada",
          description: "O ticket foi enviado para processamento pela IA.",
        });
      } else {
        toast({
          title: "Erro na solicitação",
          description: "Não foi possível processar o ticket. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao solicitar análise da IA:", error);
      toast({
        title: "Erro na solicitação",
        description: "Ocorreu um erro ao solicitar a análise da IA.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
            onClick={handleRequestAIAnalysis}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? "Processando..." : "Analisar com IA"}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!newMessage.trim() && newFiles.length === 0)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Enviando..." : "Enviar Resposta"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TicketConversation;
