
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Copy, Plus, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  variables?: string[];
}

interface ResponseTemplatesProps {
  ticketCategory: string;
  clientName?: string;
  ticketId?: string;
  onTemplateSelect: (content: string) => void;
}

const ResponseTemplates: React.FC<ResponseTemplatesProps> = ({
  ticketCategory,
  clientName = 'Cliente',
  ticketId = '',
  onTemplateSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Enhanced templates with variables
  const templates: Template[] = [
    {
      id: '1',
      title: 'Confirmação de Recebimento',
      content: 'Olá {{cliente}}! Recebemos sua solicitação (Ticket #{{ticket_id}}) e já estamos analisando. Em breve retornaremos com uma resposta.',
      category: 'general_inquiry',
      tags: ['confirmação', 'recebimento'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '2',
      title: 'Solicitação de Informações',
      content: 'Olá {{cliente}}, para prosseguirmos com sua solicitação do ticket #{{ticket_id}}, precisamos de algumas informações adicionais. Poderia nos fornecer mais detalhes sobre o problema?',
      category: 'technical_issue',
      tags: ['informações', 'detalhes'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '3',
      title: 'Resolução - Problema Técnico',
      content: 'Olá {{cliente}}, identificamos a causa do problema reportado no ticket #{{ticket_id}} e aplicamos a correção. Por favor, teste e nos informe se a solução funcionou.',
      category: 'technical_issue',
      tags: ['resolução', 'técnico'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '4',
      title: 'Agradecimento e Encerramento',
      content: 'Olá {{cliente}}, fico feliz em saber que conseguimos resolver seu problema no ticket #{{ticket_id}}! Se precisar de mais alguma coisa, não hesite em nos contatar.',
      category: 'general_inquiry',
      tags: ['agradecimento', 'encerramento'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '5',
      title: 'Escalonamento para Especialista',
      content: 'Olá {{cliente}}, sua solicitação do ticket #{{ticket_id}} requer análise de nosso especialista. Transferimos o caso e você receberá uma resposta em breve.',
      category: 'technical_issue',
      tags: ['escalonamento', 'especialista'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '6',
      title: 'Solicitação de Teste',
      content: 'Olá {{cliente}}, implementamos uma correção para o problema reportado no ticket #{{ticket_id}}. Poderia testar e nos confirmar se está funcionando corretamente?',
      category: 'technical_issue',
      tags: ['teste', 'correção'],
      variables: ['cliente', 'ticket_id']
    },
    {
      id: '7',
      title: 'Acompanhamento de Status',
      content: 'Olá {{cliente}}, este é um acompanhamento do ticket #{{ticket_id}}. Estamos progredindo na resolução e manteremos você informado sobre próximos passos.',
      category: 'general_inquiry',
      tags: ['acompanhamento', 'status'],
      variables: ['cliente', 'ticket_id']
    }
  ];

  const processTemplateVariables = (template: Template): string => {
    let processedContent = template.content;
    
    // Replace variables with actual values
    processedContent = processedContent.replace(/\{\{cliente\}\}/g, clientName);
    processedContent = processedContent.replace(/\{\{ticket_id\}\}/g, ticketId.slice(-6) || '######');
    
    return processedContent;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleCopyTemplate = (template: Template) => {
    const processedContent = processTemplateVariables(template);
    navigator.clipboard.writeText(processedContent);
    toast({
      title: 'Template copiado',
      description: 'O texto foi copiado para a área de transferência.',
    });
  };

  const handleUseTemplate = (template: Template) => {
    const processedContent = processTemplateVariables(template);
    onTemplateSelect(processedContent);
    toast({
      title: 'Template aplicado',
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

        {/* Quick Categories */}
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant={ticketCategory === 'technical_issue' ? 'default' : 'secondary'}
            className="cursor-pointer text-xs"
            onClick={() => setSearchTerm('técnico')}
          >
            Técnico
          </Badge>
          <Badge 
            variant="secondary"
            className="cursor-pointer text-xs"
            onClick={() => setSearchTerm('confirmação')}
          >
            Confirmação
          </Badge>
          <Badge 
            variant="secondary"
            className="cursor-pointer text-xs"
            onClick={() => setSearchTerm('resolução')}
          >
            Resolução
          </Badge>
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
                  {template.variables && (
                    <Wand2 className="h-3 w-3 text-blue-500" title="Template com variáveis" />
                  )}
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-3">
                  {processTemplateVariables(template)}
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
