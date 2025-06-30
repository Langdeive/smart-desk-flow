
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

const AgentWorkspace = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prioritizedTickets, selectedTicket]);

  // Get user display name from user metadata or email
  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    // Try to get name from user_metadata first
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Fallback to first part of email
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Usuário';
  };

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

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 -mt-4">
        <div className="border-b bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Central de Atendimento</h1>
              <p className="text-gray-600">
                {prioritizedTickets.length} tickets aguardando atendimento
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">
                  Agente: {getUserDisplayName()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                <kbd className="px-1 py-0.5 bg-gray-100 rounded">J</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded">K</kbd> navegar • 
                <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1">Esc</kbd> fechar
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Ticket Queue Panel */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <TicketQueue
                tickets={prioritizedTickets}
                selectedTicket={selectedTicket}
                onTicketSelect={handleTicketSelect}
                onTicketUpdate={handleTicketUpdate}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Workspace Panel */}
            <ResizablePanel defaultSize={65} minSize={50}>
              {selectedTicket ? (
                <WorkspacePanel
                  ticket={selectedTicket}
                  onTicketUpdate={handleTicketUpdate}
                  onClose={() => setSelectedTicket(null)}
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
      </div>
    </AppLayout>
  );
};

export default AgentWorkspace;
