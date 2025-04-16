
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Ticket, TicketStatus } from "@/types";
import { getAllTickets } from "@/services/ticketService";
import { useToast } from "@/hooks/use-toast";
import TicketList from "@/components/ticket/TicketList";
import TicketFilters from "@/components/ticket/TicketFilters";
import TicketStats from "@/components/ticket/TicketStats";
import TicketPagination from "@/components/ticket/TicketPagination";

const ITEMS_PER_PAGE = 10;

const TicketDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the ticket list
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      <TicketStats tickets={tickets} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tickets</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os chamados da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleRefresh={handleRefresh}
            loading={loading}
          />

          <TicketList tickets={paginatedTickets} loading={loading} />
          
          <TicketPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDashboard;
