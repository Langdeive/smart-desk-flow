
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageList } from '@/components/MessageList';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from '@/hooks/use-toast';
import { Message, Attachment, Ticket } from '@/types';
import { Send, Loader2, Save } from 'lucide-react';
import { addMessageToTicket, uploadAttachment } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';

interface WorkspaceConversationProps {
  ticket: Ticket;
  messages: Message[];
  attachments: Attachment[];
  onTicketUpdate: () => void;
  onTemplateContent?: (content: string) => void;
}

const WorkspaceConversation: React.FC<WorkspaceConversationProps> = ({
  ticket,
  messages,
  attachments,
  onTicketUpdate,
  onTemplateContent
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = `draft_${ticket.id}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !newMessage) {
      setNewMessage(savedDraft);
    }
  }, [ticket.id]);

  // Save draft on message change
  useEffect(() => {
    const draftKey = `draft_${ticket.id}`;
    if (newMessage.trim()) {
      localStorage.setItem(draftKey, newMessage);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [newMessage, ticket.id]);

  // Handle template content from parent
  useEffect(() => {
    if (onTemplateContent) {
      onTemplateContent = (content: string) => {
        setNewMessage(prev => prev ? `${prev}\n\n${content}` : content);
        textareaRef.current?.focus();
      };
    }
  }, [onTemplateContent]);

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

      // Clear draft
      localStorage.removeItem(`draft_${ticket.id}`);
      
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
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // Manual save (already auto-saving)
      toast({
        title: 'Rascunho salvo',
        description: 'Sua mensagem foi salva automaticamente.',
      });
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Rascunho salvo',
      description: 'Sua mensagem foi salva e pode ser retomada depois.',
    });
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
            ref={textareaRef}
            placeholder="Digite sua resposta... (Ctrl+Enter para enviar, Ctrl+S para salvar rascunho)"
            className="min-h-[100px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileUploader
                files={newFiles}
                setFiles={setNewFiles}
                maxFiles={3}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Salvar Rascunho
              </Button>
            </div>
            
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
          
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>💡 Dica: Use Ctrl+Enter para enviar rapidamente</span>
            {newMessage.trim() && (
              <span className="text-green-600">● Rascunho salvo automaticamente</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceConversation;
