
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/MessageList';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { Message, Attachment, Ticket } from '@/types';
import { Send, Loader2 } from 'lucide-react';
import { addMessageToTicket, uploadAttachment } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';

interface WorkspaceConversationProps {
  ticket: Ticket;
  messages: Message[];
  attachments: Attachment[];
  onTicketUpdate: () => void;
}

const WorkspaceConversation: React.FC<WorkspaceConversationProps> = ({
  ticket,
  messages,
  attachments,
  onTicketUpdate
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && newFiles.length === 0) return;
    if (!user) return;

    setIsLoading(true);
    try {
      // Add message
      const message = await addMessageToTicket({
        ticketId: ticket.id,
        content: newMessage,
        userId: user.id,
        isFromClient: false,
        isAutomatic: false,
      });

      // Upload attachments if any
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(file =>
          uploadAttachment(file, ticket.id, message.id)
        );
        await Promise.all(uploadPromises);
      }

      setNewMessage('');
      setNewFiles([]);
      onTicketUpdate();
      
      toast({
        title: 'Resposta enviada',
        description: 'Sua resposta foi enviada com sucesso.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua resposta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <MessageList messages={messages} attachments={attachments} />
          </CardContent>
        </Card>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Digite sua resposta... (Ctrl+Enter para enviar)"
            className="min-h-[100px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center justify-between">
            <FileUploader
              files={newFiles}
              setFiles={setNewFiles}
              maxFiles={3}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!newMessage.trim() && newFiles.length === 0)}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            💡 Dica: Use Ctrl+Enter para enviar rapidamente
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceConversation;
