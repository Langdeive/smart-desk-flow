
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { XCircle, AlertTriangle } from 'lucide-react';

interface ArticleRejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
  isRejecting?: boolean;
}

export function ArticleRejectionDialog({
  open,
  onOpenChange,
  onReject,
  isRejecting = false
}: ArticleRejectionDialogProps) {
  const [reason, setReason] = useState('');

  const handleReject = () => {
    if (reason.trim()) {
      onReject(reason.trim());
      setReason(''); // Reset for next time
    }
  };

  const commonReasons = [
    'Conteúdo não é relevante suficiente',
    'Informações incorretas ou desatualizadas',
    'Já existe artigo similar na base',
    'Muito específico para um caso particular',
    'Precisa de mais detalhes técnicos'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Rejeitar Artigo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <strong>Atenção:</strong> Ao rejeitar este artigo, ele não será publicado 
              na base de conhecimento. A Helena aprenderá com este feedback.
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da rejeição</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explique por que este artigo não deve ser publicado..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Motivos comuns:</Label>
            <div className="space-y-1">
              {commonReasons.map((commonReason, index) => (
                <button
                  key={index}
                  type="button"
                  className="text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded border border-transparent hover:border-border w-full"
                  onClick={() => setReason(commonReason)}
                >
                  • {commonReason}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRejecting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isRejecting || !reason.trim()}
          >
            {isRejecting ? (
              <>Rejeitando...</>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar Artigo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
