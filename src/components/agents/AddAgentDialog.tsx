
import React from 'react';
import { Agent } from '@/hooks/useAgents';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AgentForm from './AgentForm';

interface AddAgentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAgent: (data: Omit<Agent, 'id' | 'status'>) => Promise<boolean>;
  isAdding: boolean;
}

export default function AddAgentDialog({ isOpen, onOpenChange, onAddAgent, isAdding }: AddAgentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Adicionar Agente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Agente</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo agente.
          </DialogDescription>
        </DialogHeader>
        <AgentForm 
          onSubmit={onAddAgent} 
          isAdding={isAdding}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
