
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useAuth } from "@/hooks/useAuth";
import { useAgents } from '@/hooks/useAgents';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const agentSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  funcao: z.enum(['admin', 'agent'], {
    required_error: 'Função é obrigatória'
  })
});

export default function AgentManagement() {
  const { companyId } = useAuth();
  const { agents, loading, isAdding, fetchAgents, addAgent } = useAgents(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      nome: '',
      email: '',
      funcao: 'agent'
    }
  });

  const onSubmit = async (data: z.infer<typeof agentSchema>) => {
    console.log("Form submitted with data:", data);
    console.log("Company ID:", companyId);
    
    const success = await addAgent({
      nome: data.nome,
      email: data.email,
      funcao: data.funcao
    });
    
    if (success) {
      form.reset();
      setDialogOpen(false);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status display text and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active': 
        return { text: 'Ativo', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      case 'inactive': 
        return { text: 'Inativo', icon: <AlertCircle className="h-4 w-4 text-red-500" /> };
      case 'awaiting': 
        return { text: 'Aguardando Ativação', icon: <Clock className="h-4 w-4 text-amber-500" /> };
      default: 
        return { text: status, icon: null };
    }
  };

  console.log("Current agents:", agents);
  console.log("Loading state:", loading);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Agentes</h1>
      
      <div className="flex justify-between mb-4">
        <Input 
          placeholder="Buscar por nome ou e-mail" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do agente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E-mail do agente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="funcao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agent">Agente</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isAdding}>
                  {isAdding ? 'Adicionando...' : 'Adicionar Agente'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando agentes...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-4">Nenhum agente cadastrado</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map(agent => {
              const status = getStatusDisplay(agent.status);
              return (
                <TableRow key={agent.id}>
                  <TableCell>{agent.nome}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.funcao === 'admin' ? 'Administrador' : 'Agente'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {status.icon}
                      {status.text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
