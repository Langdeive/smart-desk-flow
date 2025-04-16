
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import { Ticket } from "@/types";

interface AIAnalysisPanelProps {
  ticket: Ticket;
  onReanalyze?: () => void;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ ticket, onReanalyze }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Análise da IA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Sentimento</p>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              Positivo
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium">Sugestão</p>
            <p className="text-sm text-muted-foreground">
              O cliente está interessado em um novo recurso. Prioridade sugerida: média.
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Artigos Relacionados</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>
                <a href="#" className="text-blue-500 hover:underline">
                  Como exportar relatórios
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-500 hover:underline">
                  Solicitação de novos recursos
                </a>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onReanalyze}>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Reanalisar com IA
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAnalysisPanel;
