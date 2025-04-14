
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Ticket, TicketStatus } from "@/types";

// Função mockada para demonstração - será substituída pela integração com Supabase
const getMockTickets = (): Ticket[] => {
  return [
    {
      id: "1",
      title: "Aplicativo trava ao iniciar",
      description: "Estou enfrentando problemas ao abrir o aplicativo. Ele trava na tela inicial.",
      status: "new",
      priority: "high",
      category: "technical_issue",
      userId: "user1",
      companyId: "company1",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      source: "web",
      aiProcessed: true,
      needsHumanReview: false,
    },
    {
      id: "2",
      title: "Solicitação de novo recurso",
      description: "Gostaria de sugerir a adição de um novo recurso que permitiria aos usuários exportar relatórios.",
      status: "in_progress",
      priority: "medium",
      category: "feature_request",
      userId: "user2",
      agentId: "agent1",
      companyId: "company1",
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 86400000),
      source: "email",
      aiProcessed: true,
      needsHumanReview: true,
    },
    {
      id: "3",
      title: "Dúvida sobre cobrança",
      description: "Notei uma cobrança duplicada na minha fatura. Poderia verificar?",
      status: "waiting_for_client",
      priority: "low",
      category: "billing",
      userId: "user3",
      agentId: "agent2",
      companyId: "company2",
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 172800000),
      source: "web",
      aiProcessed: true,
      needsHumanReview: true,
    },
  ];
};

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
  const [tickets, setTickets] = useState<Ticket[]>(getMockTickets());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
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
        <Button>Novo Ticket</Button>
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
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
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhum ticket encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">#{ticket.id}</TableCell>
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
                        <Button variant="ghost" size="sm">Ver</Button>
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
