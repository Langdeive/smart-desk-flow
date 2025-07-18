import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Message, Attachment } from '@/types';
import { X, MessageSquare, FileText, Clock, User, Settings } from 'lucide-react';
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
  isMobile?: boolean;
}

const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  ticket,
  onTicketUpdate,
  onClose,
  isMobile = false
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

  // Mobile layout with controlled height
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* Compact Mobile Header */}
        <div className="border-b px-3 py-2 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  #{ticket.id.slice(-6)}
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xs text-gray-900 font-medium mb-1 line-clamp-2">
                {ticket.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{getClientName()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Content with controlled overflow */}
        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start px-3 py-1 flex-shrink-0 h-8">
              <TabsTrigger value="conversation" className="flex items-center gap-1 text-xs px-2">
                <MessageSquare className="h-3 w-3" />
                Conversa
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-1 text-xs px-2">
                <FileText className="h-3 w-3" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-1 text-xs px-2">
                <Settings className="h-3 w-3" />
                Ações
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden min-h-0">
              <TabsContent value="conversation" className="h-full m-0">
                <WorkspaceConversation
                  ref={conversationRef}
                  ticket={ticket}
                  messages={messages}
                  attachments={attachments}
                  onTicketUpdate={handleTicketUpdate}
                />
              </TabsContent>

              <TabsContent value="details" className="h-full m-0 overflow-y-auto">
                <div className="p-3">
                  <WorkspaceDetails
                    ticket={ticket}
                    onTicketUpdate={handleTicketUpdate}
                  />
                </div>
              </TabsContent>

              <TabsContent value="actions" className="h-full m-0 overflow-y-auto">
                <div className="p-3 space-y-3">
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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop layout with controlled height and overflow
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Content starts directly with tabs - controlled height */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            {/* Tab navigation with close button */}
            <div className="flex items-center justify-between border-b px-4 py-2 flex-shrink-0">
              <TabsList className="h-9">
                <TabsTrigger value="conversation" className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Conversa
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Detalhes
                </TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-hidden min-h-0">
              <TabsContent value="conversation" className="h-full m-0">
                <WorkspaceConversation
                  ref={conversationRef}
                  ticket={ticket}
                  messages={messages}
                  attachments={attachments}
                  onTicketUpdate={handleTicketUpdate}
                />
              </TabsContent>

              <TabsContent value="details" className="h-full m-0 overflow-y-auto">
                <div className="p-4">
                  <WorkspaceDetails
                    ticket={ticket}
                    onTicketUpdate={handleTicketUpdate}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Compact Right Sidebar with controlled height */}
        <div className="hidden xl:block w-64 border-l bg-gray-50 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-3">
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
