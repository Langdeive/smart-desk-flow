
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import { Ticket, TicketPriority } from "@/types";
import { priorityLabels } from "./TicketUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { reprocessTicket } from "@/services/aiProcessingService";
import { toast } from "sonner";

interface AIAnalysisPanelProps {
  ticket: Ticket;
  aiClassification?: string;
  suggestedPriority?: TicketPriority;
  needsAdditionalInfo?: boolean;
  confidenceScore?: number;
  onReprocess?: () => void;
  isProcessing?: boolean;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  ticket,
  aiClassification,
  suggestedPriority,
  needsAdditionalInfo = false,
  confidenceScore = 0,
  onReprocess,
  isProcessing = false
}) => {
  // Formatar a pontuação de confiança para porcentagem
  const formattedScore = confidenceScore ? `${Math.round(confidenceScore * 100)}%` : 'N/A';
  
  // Definir cores com base na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-700";
    if (score >= 0.6) return "text-yellow-700";
    return "text-red-700";
  };
  
  // Calcular a cor da barra de progresso
  const getProgressColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Tradução da classificação da IA
  const translateClassification = (classification?: string) => {
    if (!classification) return "Não classificado";
    
    const translations: Record<string, string> = {
      "technical_issue": "Problema técnico",
      "feature_request": "Solicitação de recurso",
      "billing_question": "Dúvida de faturamento",
      "billing": "Faturamento",
      "account_access": "Acesso à conta",
      "general_inquiry": "Consulta geral",
      "bug_report": "Relatório de bug",
      "data_request": "Solicitação de dados",
      "installation_help": "Ajuda com instalação"
    };
    
    return translations[classification] || classification;
  };

  const handleReprocessRequest = async () => {
    if (onReprocess) {
      onReprocess();
      return;
    }

    try {
      const success = await reprocessTicket(ticket.id);
      
      if (success) {
        toast.success("Ticket enviado para reanálise pela IA");
      } else {
        toast.error("Não foi possível reprocessar o ticket");
      }
    } catch (error) {
      console.error("Erro ao reprocessar ticket:", error);
      toast.error("Erro ao solicitar reanálise do ticket");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-500" />
          Análise da IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-muted-foreground">Confiança</p>
          <p className={`font-medium ${confidenceScore ? getScoreColor(confidenceScore) : ""}`}>
            {formattedScore}
          </p>
        </div>
        
        <Progress 
          value={confidenceScore ? confidenceScore * 100 : 0} 
          className={`h-2 ${confidenceScore ? getProgressColor(confidenceScore) : ""}`}
        />
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Classificação</p>
            <p className="mt-1 font-medium">{translateClassification(aiClassification)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Necessidade de Informações</p>
            <div className="mt-1">
              {needsAdditionalInfo ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Informações insuficientes
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Informações suficientes
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {suggestedPriority && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prioridade Sugerida</p>
            <Badge 
              variant="outline"
              className={
                suggestedPriority === "critical" || suggestedPriority === "high"
                  ? "border-red-500 text-red-500 mt-1" 
                  : suggestedPriority === "medium"
                    ? "border-orange-500 text-orange-500 mt-1" 
                    : "border-blue-500 text-blue-500 mt-1"
              }
            >
              {priorityLabels[suggestedPriority]}
            </Badge>
            
            {suggestedPriority !== ticket.priority && (
              <p className="text-xs text-muted-foreground mt-1">
                Diferente da prioridade atual: {priorityLabels[ticket.priority]}
              </p>
            )}
          </div>
        )}
        
        {needsAdditionalInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 inline-block mr-1" />
            A IA detectou que este ticket pode não conter informações suficientes para uma resolução eficaz.
            Considere solicitar mais detalhes ao cliente.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleReprocessRequest}
          disabled={isProcessing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Processando...' : 'Reprocessar com IA'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAnalysisPanel;
