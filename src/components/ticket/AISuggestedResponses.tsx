
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Send, MessageSquare, RefreshCw } from "lucide-react";
import { SuggestedResponse } from '@/types/suggested-response';
import { getSuggestedResponsesForTicket, approveSuggestedResponse, rejectSuggestedResponse } from '@/services/suggestedResponseService';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { processTicketWithAI } from '@/services/aiProcessingService';

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
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRejectSuggestion = async (suggestion: SuggestedResponse) => {
    try {
      setRejecting(suggestion.id);
      
      // Marca como rejeitada no banco de dados
      await rejectSuggestedResponse(suggestion.id);
      
      // Atualiza a lista de sugestões
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      toast({
        title: 'Sugestão rejeitada',
        description: 'A resposta sugerida foi rejeitada e será usada para melhorar o sistema.',
      });
    } catch (error) {
      console.error('Erro ao rejeitar sugestão:', error);
      toast({
        title: 'Erro ao rejeitar sugestão',
        description: 'Ocorreu um erro ao tentar rejeitar a resposta sugerida.',
        variant: 'destructive'
      });
    } finally {
      setRejecting(null);
    }
  };

  const handleRefreshSuggestions = async () => {
    try {
      setRefreshing(true);
      
      // Reprocessar o ticket para gerar novas sugestões
      const ticket = { id: ticketId } as any;
      await processTicketWithAI(ticket);
      
      // Recarregar as sugestões
      const data = await getSuggestedResponsesForTicket(ticketId);
      setSuggestions(data.filter(s => !s.applied));
      
      toast({
        title: 'Sugestões atualizadas',
        description: 'Novas sugestões de resposta foram geradas.',
      });
    } catch (error) {
      console.error('Erro ao atualizar sugestões:', error);
      toast({
        title: 'Erro ao atualizar sugestões',
        description: 'Ocorreu um erro ao tentar gerar novas sugestões.',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-blue-500";
    return "bg-orange-500";
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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Sugestões de Resposta
            </CardTitle>
            <CardDescription>
              {suggestions.length} {suggestions.length === 1 ? 'resposta sugerida' : 'respostas sugeridas'} pela IA
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRefreshSuggestions}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="border rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-2 w-full pr-4">
                <div className="flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className={
                      suggestion.confidence >= 0.9 ? "bg-green-100 text-green-800 border-green-300" : 
                      suggestion.confidence >= 0.7 ? "bg-blue-100 text-blue-800 border-blue-300" :
                      "bg-orange-100 text-orange-800 border-orange-300"
                    }
                  >
                    Confiança: {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
                
                <Progress 
                  value={suggestion.confidence * 100} 
                  className={`h-1 ${getConfidenceColor(suggestion.confidence)}`}
                />
              </div>
              <div className="flex space-x-2 shrink-0">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRejectSuggestion(suggestion)}
                  disabled={!!rejecting || !!applying}
                >
                  {rejecting === suggestion.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>

                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={() => handleApplySuggestion(suggestion)}
                  disabled={!!applying || !!rejecting}
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
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-3">
              {suggestion.message}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AISuggestedResponses;
