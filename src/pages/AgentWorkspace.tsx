
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTickets } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import TicketQueue from '@/components/agent-workspace/TicketQueue';
import WorkspacePanel from '@/components/agent-workspace/WorkspacePanel';
import { Ticket } from '@/types';
import { Loader2 } from 'lucide-react';

const AgentWorkspace = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [workspaceLayout, setWorkspaceLayout] = useState<'split' | 'full'>('split');

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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando workspace...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
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
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Ticket Queue Panel */}
        <div className={`${workspaceLayout === 'split' ? 'w-1/3' : 'w-full'} border-r bg-white overflow-hidden`}>
          <TicketQueue
            tickets={prioritizedTickets}
            selectedTicket={selectedTicket}
            onTicketSelect={handleTicketSelect}
            onTicketUpdate={handleTicketUpdate}
          />
        </div>

        {/* Workspace Panel */}
        {workspaceLayout === 'split' && selectedTicket && (
          <div className="flex-1 overflow-hidden">
            <WorkspacePanel
              ticket={selectedTicket}
              onTicketUpdate={handleTicketUpdate}
              onClose={() => setSelectedTicket(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWorkspace;
