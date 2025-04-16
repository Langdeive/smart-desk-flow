import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, RefreshCw, Plus } from "lucide-react";
import { Ticket, TicketStatus } from "@/types";
import { getAllTickets } from "@/services/ticketService";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<TicketStatus, string> = {
  new: "bg-blue-500",
  waiting_for_client: "bg-yellow-500",
  waiting_for_agent: "bg-purple-500",
  in_progress: "bg-orange-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const statusLabels: Record<TicketStatus, string> = {
  new: "Novo",
  waiting_for_client: "Aguardando Cliente",
  waiting_for_agent: "Aguardando Agente",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
};

const TicketDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getAllTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast({
          title: "Erro ao carregar tickets",
          description: "Não foi possível carregar a lista de tickets. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [toast]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
      toast({
        title: "Lista atualizada",
        description: "Os tickets foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a lista de tickets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = () => {
    navigate("/tickets/new");
  };

  const handleViewTicket = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Gerencie e visualize todos os chamados</p>
        </div>
        <Button onClick={handleCreateTicket}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Tickets</CardTitle>
            <CardDescription>Todos os chamados ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tickets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Aguardando Review</CardTitle>
            <CardDescription>Tickets que precisam de análise</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tickets.filter(t => t.needsHumanReview).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Respondidos Automaticamente</CardTitle>
            <CardDescription>Resolvidos pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tickets.filter(t => t.aiProcessed && !t.needsHumanReview).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tickets</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os chamados da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tickets..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => {}}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                Todos
              </TabsTrigger>
              <TabsTrigger value="new" onClick={() => setStatusFilter("new")}>
                Novos
              </TabsTrigger>
              <TabsTrigger value="in_progress" onClick={() => setStatusFilter("in_progress")}>
                Em Progresso
              </TabsTrigger>
              <TabsTrigger value="waiting_for_client" onClick={() => setStatusFilter("waiting_for_client")}>
                Aguardando Cliente
              </TabsTrigger>
              <TabsTrigger value="resolved" onClick={() => setStatusFilter("resolved")}>
                Resolvidos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando tickets...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum ticket encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">#{ticket.id.substring(0, 8)}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${statusColors[ticket.status]} text-white`}
                        >
                          {statusLabels[ticket.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          ticket.priority === "high" || ticket.priority === "critical" 
                            ? "border-red-500 text-red-500" 
                            : ticket.priority === "medium" 
                              ? "border-orange-500 text-orange-500" 
                              : "border-blue-500 text-blue-500"
                        }>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {ticket.source.charAt(0).toUpperCase() + ticket.source.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDashboard;
