import { useState, useCallback } from 'react';
import { useClients } from '@/hooks/useClients';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ClientDialog } from '@/components/clients/ClientDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from '@/hooks/useDebounce';
import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Section } from '@/components/common/Section';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Separator } from "@/components/ui/separator";
import { ActionButton } from '@/components/common/ActionButton';
import { ClientFormData } from '@/types';

export default function ClientManagement() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const debouncedSearch = useDebounce(search, 300);
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients(debouncedSearch);

  // Memoize filteredClients to prevent unnecessary re-renders
  const filteredClients = useCallback(() => {
    if (!clients) return [];
    return clients.filter(client => {
      if (status === 'all') return true;
      return status === 'active' ? client.is_active : !client.is_active;
    });
  }, [clients, status])();

  const handleDelete = useCallback((id: string) => {
    deleteClient.mutate(id);
  }, [deleteClient]);

  const handleDialogOpen = useCallback(() => {
    setSelectedClientId(null);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setSelectedClientId(null);
    setDialogOpen(false);
  }, []);

  const handleEditClient = useCallback((id: string) => {
    setSelectedClientId(id);
    setDialogOpen(true);
  }, []);

  const handleSaveClient = useCallback(async (data: ClientFormData, id?: string) => {
    if (id) {
      await updateClient.mutateAsync({ id, ...data });
    } else {
      await createClient.mutateAsync(data);
    }
  }, [createClient, updateClient]);

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <SectionHeader 
          title="Clientes"
          subtitle="Gerencie os clientes da sua empresa"
          centered={false}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-deep/60 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou ID externo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full md:w-[300px] border-turquoise-vibrant/20 focus:border-turquoise-vibrant focus:ring-turquoise-vibrant"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as 'all' | 'active' | 'inactive')}
          >
            <SelectTrigger className="w-[120px] border-turquoise-vibrant/20 focus:border-turquoise-vibrant focus:ring-turquoise-vibrant text-blue-deep">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-turquoise-vibrant/20">
              <SelectItem value="all" className="text-blue-deep hover:bg-turquoise-vibrant/10">Todos</SelectItem>
              <SelectItem value="active" className="text-blue-deep hover:bg-turquoise-vibrant/10">Ativos</SelectItem>
              <SelectItem value="inactive" className="text-blue-deep hover:bg-turquoise-vibrant/10">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button 
            onClick={handleDialogOpen}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Renderiza ClientDialog apenas quando está aberto */}
        {dialogOpen && (
          <ClientDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onClose={handleDialogClose} 
            clientId={selectedClientId}
            clients={clients || []}
            onSave={handleSaveClient}
            isPending={isPending}
          />
        )}
      </div>

      {error ? (
        <div className="border border-red-alert/20 rounded-lg p-6 mb-6 bg-red-alert/10 text-red-alert">
          <h3 className="text-lg font-medium mb-2">Erro ao carregar clientes</h3>
          <p>{error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os clientes. Tente novamente mais tarde.'}</p>
        </div>
      ) : (
        <div className="border border-turquoise-vibrant/20 rounded-lg overflow-hidden bg-white shadow-modern">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-blue-deep">Nome</TableHead>
                <TableHead className="font-semibold text-blue-deep">ID Externo</TableHead>
                <TableHead className="font-semibold text-blue-deep">Status</TableHead>
                <TableHead className="font-semibold text-blue-deep">Criado em</TableHead>
                <TableHead className="text-right font-semibold text-blue-deep">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-blue-deep/70">
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-blue-deep/70 mb-2">Nenhum cliente encontrado</p>
                      <p className="text-sm text-blue-deep/50">
                        {search ? 'Tente ajustar sua busca' : 'Clique em "Novo Cliente" para começar'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ClientAvatar name={client.name} />
                        <span className="font-medium text-blue-deep">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-deep/80">{client.external_id || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={client.is_active ? 'success' : 'secondary'}>
                        {client.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-blue-deep/80">
                      {client.created_at ? format(new Date(client.created_at), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client.id)}
                        >
                          Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-alert border-red-alert/20 hover:bg-red-alert hover:text-white hover:border-red-alert"
                            >
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente {client.name}? 
                                Esta ação não poderá ser desfeita e todos os contatos associados também serão excluídos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(client.id)}
                                className="bg-red-alert text-white hover:bg-red-alert/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredClients.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-blue-deep/70">
            <span>Itens por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[80px] h-8 border-turquoise-vibrant/20 focus:border-turquoise-vibrant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-turquoise-vibrant/20">
                <SelectItem value="10" className="text-blue-deep hover:bg-turquoise-vibrant/10">10</SelectItem>
                <SelectItem value="25" className="text-blue-deep hover:bg-turquoise-vibrant/10">25</SelectItem>
                <SelectItem value="50" className="text-blue-deep hover:bg-turquoise-vibrant/10">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink className="bg-gradient-to-r from-blue-deep to-turquoise-vibrant text-white border-0">1</PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
