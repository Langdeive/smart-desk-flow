
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Send, MessageSquare } from "lucide-react";
import { SuggestedResponse } from '@/types/suggested-response';
import { getSuggestedResponsesForTicket, approveSuggestedResponse } from '@/services/suggestedResponseService';
import { useToast } from '@/hooks/use-toast';

interface AISuggestedResponsesProps {
  ticketId: string;
  agentId: string;
  onApply: (message: string) => Promise<void>;
}

const AISuggestedResponses: React.FC<AISuggestedResponsesProps> = ({ 
  ticketId, 
  agentId,
  onApply 
}) => {
  const [suggestions, setSuggestions] = useState<SuggestedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await getSuggestedResponsesForTicket(ticketId);
        setSuggestions(data.filter(s => !s.applied));
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        toast({
          title: 'Erro ao carregar sugestões',
          description: 'Não foi possível carregar as sugestões da IA.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchSuggestions();
    }
  }, [ticketId, toast]);

  const handleApplySuggestion = async (suggestion: SuggestedResponse) => {
    try {
      setApplying(suggestion.id);
      
      // Primeiro aplica a sugestão na conversa
      await onApply(suggestion.message);
      
      // Depois marca como aplicada no banco de dados
      await approveSuggestedResponse(suggestion.id, agentId);
      
      // Atualiza a lista de sugestões
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      toast({
        title: 'Sugestão aplicada',
        description: 'A resposta sugerida foi enviada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      toast({
        title: 'Erro ao aplicar sugestão',
        description: 'Ocorreu um erro ao tentar aplicar a resposta sugerida.',
        variant: 'destructive'
      });
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Carregando sugestões da IA...</span>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null; // Não mostrar o componente se não houver sugestões
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Sugestões de Resposta
        </CardTitle>
        <CardDescription>
          Respostas sugeridas com base na análise da IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant="outline" 
                className={
                  suggestion.confidence >= 0.9 ? "bg-green-100 text-green-800 border-green-300" : 
                  suggestion.confidence >= 0.7 ? "bg-blue-100 text-blue-800 border-blue-300" :
                  "bg-amber-100 text-amber-800 border-amber-300"
                }
              >
                Confiança: {Math.round(suggestion.confidence * 100)}%
              </Badge>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={() => handleApplySuggestion(suggestion)}
                  disabled={!!applying}
                  className="flex items-center"
                >
                  {applying === suggestion.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Send className="h-4 w-4 mr-1" />
                  )}
                  Aplicar
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {suggestion.message}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AISuggestedResponses;
