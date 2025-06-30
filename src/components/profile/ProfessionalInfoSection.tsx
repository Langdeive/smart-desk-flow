
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { Building2, Calendar, User, Briefcase } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  department?: string;
  onDepartmentChange: (department: string) => void;
}

export function ProfessionalInfoSection({ department, onDepartmentChange }: ProfessionalInfoSectionProps) {
  const { user, role } = useAuth();

  const roleLabels = {
    admin: 'Administrador',
    owner: 'Proprietário',
    agent: 'Agente',
    client: 'Cliente',
    developer: 'Desenvolvedor'
  };

  const roleColors = {
    admin: 'bg-blue-500',
    owner: 'bg-purple-500',
    agent: 'bg-green-500',
    client: 'bg-orange-500',
    developer: 'bg-red-500'
  };

  return (
    <Card className="force-white-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-turquoise-vibrant" />
          <div>
            <CardTitle className="text-xl">Informações Profissionais</CardTitle>
            <CardDescription>
              Dados relacionados ao seu trabalho e empresa
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </Label>
            <Input 
              value="SolveFlow" 
              disabled 
              className="force-white-input bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              A empresa não pode ser alterada nesta tela
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cargo/Função
            </Label>
            <div className="flex items-center">
              <Badge 
                variant="secondary" 
                className={`${roleColors[role as keyof typeof roleColors] || 'bg-turquoise-vibrant'} text-white`}
              >
                {roleLabels[role as keyof typeof roleLabels] || 'Usuário'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              O cargo é definido pelo administrador
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Input 
              id="department"
              value={department || ''}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="force-white-input"
              placeholder="Ex: Suporte, Vendas, TI..."
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Membro desde
            </Label>
            <Input 
              value={new Date(user?.created_at || '').toLocaleDateString('pt-BR')} 
              disabled 
              className="force-white-input bg-gray-50"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">Estatísticas Rápidas</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-turquoise-vibrant">-</div>
              <div className="text-sm text-gray-600">Tickets Ativos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-turquoise-vibrant">-</div>
              <div className="text-sm text-gray-600">Tickets Resolvidos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-turquoise-vibrant">-</div>
              <div className="text-sm text-gray-600">Tempo Médio</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Estatísticas detalhadas serão implementadas na Fase 3
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
