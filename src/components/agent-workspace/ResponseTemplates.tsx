
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface ResponseTemplatesProps {
  ticketCategory: string;
  onTemplateSelect: (template: Template) => void;
}

const ResponseTemplates: React.FC<ResponseTemplatesProps> = ({
  ticketCategory,
  onTemplateSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock templates - in a real app, these would come from a database
  const templates: Template[] = [
    {
      id: '1',
      title: 'Confirmação de Recebimento',
      content: 'Olá! Recebemos sua solicitação e já estamos analisando. Em breve retornaremos com uma resposta.',
      category: 'general_inquiry',
      tags: ['confirmação', 'recebimento']
    },
    {
      id: '2',
      title: 'Solicitação de Informações',
      content: 'Para prosseguirmos com sua solicitação, precisamos de algumas informações adicionais. Poderia nos fornecer mais detalhes sobre o problema?',
      category: 'technical_issue',
      tags: ['informações', 'detalhes']
    },
    {
      id: '3',
      title: 'Resolução - Problema Técnico',
      content: 'Identificamos a causa do problema e aplicamos a correção. Por favor, teste e nos informe se a solução funcionou.',
      category: 'technical_issue',
      tags: ['resolução', 'técnico']
    },
    {
      id: '4',
      title: 'Agradecimento e Encerramento',
      content: 'Fico feliz em saber que conseguimos resolver seu problema! Se precisar de mais alguma coisa, não hesite em nos contatar.',
      category: 'general_inquiry',
      tags: ['agradecimento', 'encerramento']
    },
    {
      id: '5',
      title: 'Escalonamento para Especialista',
      content: 'Sua solicitação requer análise de nosso especialista. Transferimos o caso e você receberá uma resposta em breve.',
      category: 'technical_issue',
      tags: ['escalonamento', 'especialista']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleCopyTemplate = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    toast({
      title: 'Template copiado',
      description: 'O texto foi copiado para a área de transferência.',
    });
  };

  const handleUseTemplate = (template: Template) => {
    onTemplateSelect(template);
    toast({
      title: 'Template selecionado',
      description: 'O template foi adicionado à sua resposta.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Templates de Resposta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>

        {/* Templates List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum template encontrado
            </p>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-3 space-y-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm text-gray-900">
                    {template.title}
                  </h4>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-3">
                  {template.content}
                </p>
                
                <div className="flex items-center gap-1 flex-wrap">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyTemplate(template)}
                    className="flex-1 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Usar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Template Button */}
        <Button variant="outline" size="sm" className="w-full text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Criar Novo Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResponseTemplates;
