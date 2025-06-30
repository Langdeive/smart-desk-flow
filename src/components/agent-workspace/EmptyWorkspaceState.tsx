
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, TrendingUp, ArrowRight } from 'lucide-react';

interface EmptyWorkspaceStateProps {
  ticketCount: number;
  onSelectFirstTicket: () => void;
}

const EmptyWorkspaceState: React.FC<EmptyWorkspaceStateProps> = ({
  ticketCount,
  onSelectFirstTicket
}) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Central de Atendimento
          </h2>
          <p className="text-gray-600">
            Selecione um ticket para começar o atendimento
          </p>
        </div>

        {ticketCount > 0 ? (
          <div className="space-y-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {ticketCount} tickets aguardando
                      </p>
                      <p className="text-sm text-blue-700">
                        Comece pelo mais antigo
                      </p>
                    </div>
                  </div>
                  <Button onClick={onSelectFirstTicket} size="sm">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Começar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
                Tudo em dia!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Não há tickets pendentes no momento. Você está em dia com o atendimento!
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="bg-white p-3 rounded-lg border">
            <div className="font-medium text-gray-700 mb-1">Atalhos</div>
            <div className="space-y-1">
              <div><kbd className="bg-gray-100 px-1 rounded">J</kbd>/<kbd className="bg-gray-100 px-1 rounded">K</kbd> Navegar</div>
              <div><kbd className="bg-gray-100 px-1 rounded">Esc</kbd> Fechar</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="font-medium text-gray-700 mb-1">Dicas</div>
            <div className="space-y-1">
              <div>• Priorize tickets críticos</div>
              <div>• Use templates para agilizar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyWorkspaceState;
