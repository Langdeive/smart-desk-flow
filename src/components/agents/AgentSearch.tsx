
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type AgentSearchProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function AgentSearch({ searchTerm, onSearchChange }: AgentSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar agentes por nome ou email"
        className="pl-9 w-full md:w-[300px]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
