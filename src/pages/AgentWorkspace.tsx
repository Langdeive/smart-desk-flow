
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTickets } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import TicketQueue from '@/components/agent-workspace/TicketQueue';
import WorkspacePanel from '@/components/agent-workspace/WorkspacePanel';
import EmptyWorkspaceState from '@/components/agent-workspace/EmptyWorkspaceState';
import { Ticket } from '@/types';
import { Loader2 } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const AgentWorkspace = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState('queue');

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: getAllTickets,
  });

  // Filter tickets that need attention (prioritize by status and SLA)
  const prioritizedTickets = tickets ? tickets
    .filter(ticket => ['new', 'waiting_for_agent', 'in_progress'].includes(ticket.status))
    .sort((a, b) => {
      // Priority order: critical > high > medium > low
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Then by creation date (oldest first)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }) : [];

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // Switch to ticket tab on mobile when selecting a ticket
    if (isMobile) {
      setActiveTab('ticket');
    }
  };

  const handleTicketUpdate = () => {
    refetch();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          // Next ticket
          if (prioritizedTickets.length > 0) {
            const currentIndex = selectedTicket ? 
              prioritizedTickets.findIndex(t => t.id === selectedTicket.id) : -1;
            const nextIndex = (currentIndex + 1) % prioritizedTickets.length;
            setSelectedTicket(prioritizedTickets[nextIndex]);
          }
          break;
        case 'k':
          // Previous ticket
          if (prioritizedTickets.length > 0) {
            const currentIndex = selectedTicket ? 
              prioritizedTickets.findIndex(t => t.id === selectedTicket.id) : 0;
            const prevIndex = currentIndex <= 0 ? prioritizedTickets.length - 1 : currentIndex - 1;
            setSelectedTicket(prioritizedTickets[prevIndex]);
          }
          break;
        case 'escape':
          setSelectedTicket(null);
          if (isMobile) {
            setActiveTab('queue');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prioritizedTickets, selectedTicket, isMobile]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Carregando workspace...</span>
        </div>
      </AppLayout>
    );
  }

  // Mobile Layout with Tabs
  if (isMobile) {
    return (
      <AppLayout>
        <div className="flex flex-col h-full">
          {/* Mobile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-2 mt-2 h-8">
              <TabsTrigger value="queue" className="text-xs">
                Fila ({prioritizedTickets.length})
              </TabsTrigger>
              <TabsTrigger value="ticket" disabled={!selectedTicket} className="text-xs">
                Ticket
              </TabsTrigger>
              <TabsTrigger value="actions" disabled={!selectedTicket} className="text-xs">
                Ações
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="queue" className="h-full m-0">
                <TicketQueue
                  tickets={prioritizedTickets}
                  selectedTicket={selectedTicket}
                  onTicketSelect={handleTicketSelect}
                  onTicketUpdate={handleTicketUpdate}
                />
              </TabsContent>

              <TabsContent value="ticket" className="h-full m-0">
                {selectedTicket ? (
                  <WorkspacePanel
                    ticket={selectedTicket}
                    onTicketUpdate={handleTicketUpdate}
                    onClose={() => {
                      setSelectedTicket(null);
                      setActiveTab('queue');
                    }}
                    isMobile={true}
                  />
                ) : (
                  <EmptyWorkspaceState
                    ticketCount={prioritizedTickets.length}
                    onSelectFirstTicket={() => {
                      if (prioritizedTickets.length > 0) {
                        setSelectedTicket(prioritizedTickets[0]);
                      }
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="actions" className="h-full m-0">
                {selectedTicket && (
                  <div className="p-3">
                    <h3 className="font-semibold mb-3 text-sm">Ações Rápidas</h3>
                    {/* Actions content will be moved here */}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </AppLayout>
    );
  }

  // Desktop Layout - Fixed positioning and spacing
  return (
    <AppLayout>
      <div className="flex-1 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Ticket Queue Panel */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
            <TicketQueue
              tickets={prioritizedTickets}
              selectedTicket={selectedTicket}
              onTicketSelect={handleTicketSelect}
              onTicketUpdate={handleTicketUpdate}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Workspace Panel */}
          <ResizablePanel defaultSize={70} minSize={55}>
            {selectedTicket ? (
              <WorkspacePanel
                ticket={selectedTicket}
                onTicketUpdate={handleTicketUpdate}
                onClose={() => setSelectedTicket(null)}
                isMobile={false}
              />
            ) : (
              <EmptyWorkspaceState
                ticketCount={prioritizedTickets.length}
                onSelectFirstTicket={() => {
                  if (prioritizedTickets.length > 0) {
                    setSelectedTicket(prioritizedTickets[0]);
                  }
                }}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
};

export default AgentWorkspace;
