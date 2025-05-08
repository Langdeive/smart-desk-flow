
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Agent } from '@/hooks/useAgents';

type AgentEditDialogProps = {
  agent: Agent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { funcao: 'admin' | 'agent'; status: 'active' | 'inactive' }) => Promise<boolean>;
  isSaving?: boolean;
};

export function AgentEditDialog({ 
  agent, 
  isOpen, 
  onOpenChange, 
  onSave, 
  isSaving = false 
}: AgentEditDialogProps) {
  const [role, setRole] = React.useState<'admin' | 'agent'>('agent');
  const [isActive, setIsActive] = React.useState(true);

  // Reset form when agent changes or dialog opens
  React.useEffect(() => {
    if (agent && isOpen) {
      setRole(agent.funcao);
      setIsActive(agent.status === 'active');
    }
  }, [agent, isOpen]);

  const handleSave = async () => {
    const success = await onSave({
      funcao: role,
      status: isActive ? 'active' : 'inactive'
    });
    
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agente</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <div className="text-sm font-medium">{agent?.nome || ''}</div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="text-sm font-medium">{agent?.email || ''}</div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select value={role} onValueChange={(value: any) => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="agent">Agente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Ativo</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
