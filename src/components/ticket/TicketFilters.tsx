
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";
import { TicketStatus } from "@/types";

interface TicketFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: TicketStatus | "all";
  setStatusFilter: (status: TicketStatus | "all") => void;
  handleRefresh: () => void;
  loading: boolean;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleRefresh,
  loading,
}) => {
  return (
    <>
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
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue={statusFilter} className="mb-6">
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
    </>
  );
};

export default TicketFilters;
