
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Message, Attachment } from '@/types';
import { X, MessageSquare, FileText, Clock, User } from 'lucide-react';
import { getMessagesForTicket, getAttachmentsForTicket } from '@/services/ticketService';
import { useQuery } from '@tanstack/react-query';
import WorkspaceConversation, { WorkspaceConversationRef } from './WorkspaceConversation';
import WorkspaceDetails from './WorkspaceDetails';
import WorkspaceActions from './WorkspaceActions';
import ResponseTemplates from './ResponseTemplates';

interface WorkspacePanelProps {
  ticket: Ticket;
  onTicketUpdate: () => void;
  onClose: () => void;
}

const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  ticket,
  onTicketUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('conversation');
  const conversationRef = useRef<WorkspaceConversationRef>(null);

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['ticket-messages', ticket.id],
    queryFn: () => getMessagesForTicket(ticket.id),
  });

  const { data: attachments = [] } = useQuery({
    queryKey: ['ticket-attachments', ticket.id],
    queryFn: () => getAttachmentsForTicket(ticket.id),
  });

  const handleTicketUpdate = () => {
    onTicketUpdate();
    refetchMessages();
  };

  const handleTemplateSelect = (content: string) => {
    // Switch to conversation tab if not already there
    if (activeTab !== 'conversation') {
      setActiveTab('conversation');
    }
    
    // Add template content to conversation
    if (conversationRef.current) {
      conversationRef.current.addTemplateContent(content);
    }
  };

  // Get client name from ticket data or user ID
  const getClientName = () => {
    // In a real app, you'd fetch client data from the database
    // For now, we'll use the userId or a placeholder
    return ticket.userId || 'Cliente';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                #{ticket.id.slice(-6)}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-sm text-gray-900 font-medium mb-2">
              {ticket.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Cliente: {getClientName()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Criado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start px-6 py-2 flex-shrink-0">
              <TabsTrigger value="conversation" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversa
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="conversation" className="h-full m-0">
                <WorkspaceConversation
                  ref={conversationRef}
                  ticket={ticket}
                  messages={messages}
                  attachments={attachments}
                  onTicketUpdate={handleTicketUpdate}
                />
              </TabsContent>

              <TabsContent value="details" className="h-full m-0 p-6">
                <WorkspaceDetails
                  ticket={ticket}
                  onTicketUpdate={handleTicketUpdate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-gray-50 overflow-y-auto flex-shrink-0">
          <div className="p-4 space-y-4">
            <WorkspaceActions
              ticket={ticket}
              onTicketUpdate={handleTicketUpdate}
            />
            
            <ResponseTemplates
              ticketCategory={ticket.category}
              clientName={getClientName()}
              ticketId={ticket.id}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePanel;
