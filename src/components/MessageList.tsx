
import React from "react";
import { Message, Attachment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  attachments: Attachment[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages, attachments }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Função auxiliar para encontrar anexos de uma mensagem
  const getMessageAttachments = (messageId: string) => {
    return attachments.filter(attachment => attachment.messageId === messageId);
  };

  if (messages.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhuma mensagem encontrada.</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const messageAttachments = getMessageAttachments(message.id);
        
        return (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.isFromClient ? "justify-start" : "justify-end"
            }`}
          >
            {message.isFromClient && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${message.userId}.png`} alt="Avatar" />
                <AvatarFallback>
                  {message.userId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="space-y-2 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {message.isFromClient 
                    ? "Cliente" 
                    : message.isAutomatic 
                      ? "IA" 
                      : "Agente"}
                </span>
                {message.isAutomatic && (
                  <Badge variant="outline" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" /> Automático
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(message.createdAt)}
                </span>
              </div>
              
              <Card className={`${
                message.isFromClient
                  ? "bg-muted"
                  : message.isAutomatic
                    ? "bg-blue-50 border-blue-200"
                    : "bg-primary text-primary-foreground"
              }`}>
                <CardContent className="p-3 text-sm whitespace-pre-wrap">
                  {message.content}
                </CardContent>
              </Card>
              
              {messageAttachments.length > 0 && (
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Anexos:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {messageAttachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-muted rounded-full px-3 py-1 hover:bg-muted/80 transition-colors"
                      >
                        <Paperclip className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {attachment.fileName}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {!message.isFromClient && (
              <Avatar className="h-10 w-10">
                {message.isAutomatic ? (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                    <Bot className="h-5 w-5" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={`https://avatar.vercel.sh/${message.userId}.png`} alt="Avatar" />
                    <AvatarFallback>
                      {message.userId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
};
