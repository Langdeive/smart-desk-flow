
import React from 'react';
import { Input } from '@/components/ui/input';

interface AgentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AgentSearch({ searchTerm, onSearchChange }: AgentSearchProps) {
  return (
    <Input 
      placeholder="Buscar por nome ou e-mail" 
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="max-w-md"
    />
  );
}
