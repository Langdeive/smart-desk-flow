
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Ticket, TicketPriority } from "@/types";
import { priorityLabels } from "./TicketUtils";

interface AIAnalysisPanelProps {
  ticket: Ticket;
  aiClassification?: string;
  suggestedPriority?: TicketPriority;
  needsAdditionalInfo?: boolean;
  confidenceScore?: number;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  ticket,
  aiClassification,
  suggestedPriority,
  needsAdditionalInfo = false,
  confidenceScore = 0
}) => {
  // Formatar a pontuação de confiança para porcentagem
  const formattedScore = confidenceScore ? `${Math.round(confidenceScore * 100)}%` : 'N/A';
  
  // Definir cores com base na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-700";
    if (score >= 0.6) return "text-yellow-700";
    return "text-red-700";
  };
  
  // Tradução da classificação da IA
  const translateClassification = (classification?: string) => {
    if (!classification) return "Não classificado";
    
    const translations: Record<string, string> = {
      "technical_issue": "Problema técnico",
      "feature_request": "Solicitação de recurso",
      "billing_question": "Dúvida de faturamento",
      "account_access": "Acesso à conta",
      "general_inquiry": "Consulta geral",
      "bug_report": "Relatório de bug",
      "data_request": "Solicitação de dados",
      "installation_help": "Ajuda com instalação"
    };
    
    return translations[classification] || classification;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 mr-2 text-blue-500"
          >
            <path d="M12 2a5 5 0 0 1 5 5v.62a10.54 10.54 0 0 1-2.3 6.54L12 17l-2.7-2.84A10.54 10.54 0 0 1 7 7.62V7a5 5 0 0 1 5-5Z" />
            <path d="M12 17v1" />
            <path d="m9.4 16.6-1 1.7" />
            <path d="m14.6 16.6 1 1.7" />
            <path d="M3.3 16a22 22 0 0 1 17.4 0" />
            <path d="M5.9 20.5a19 19 0 0 1 12.2 0" />
          </svg>
          Análise da IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Classificação</p>
            <p className="mt-1 font-medium">{translateClassification(aiClassification)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Confiança</p>
            <p className={`mt-1 font-medium ${confidenceScore ? getScoreColor(confidenceScore) : ""}`}>
              {formattedScore}
            </p>
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
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Necessidade de Informações</p>
          <div className="flex items-center mt-1">
            {needsAdditionalInfo ? (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-amber-700 font-medium">Informações adicionais necessárias</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">Informações suficientes</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisPanel;
