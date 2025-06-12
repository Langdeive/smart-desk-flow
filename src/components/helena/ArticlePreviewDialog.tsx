
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bot, FileText } from 'lucide-react';
import { PendingArticle } from '@/types/helena';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ArticlePreviewDialogProps {
  article: PendingArticle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlePreviewDialog({
  article,
  open,
  onOpenChange
}: ArticlePreviewDialogProps) {
  const timeAgo = formatDistanceToNow(new Date(article.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Preview do Artigo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
            <span>Helena • {timeAgo}</span>
            <Badge>
              {(article.confidence_score * 100).toFixed(0)}% confiança
            </Badge>
            <span>Ticket #{article.ticket_id.slice(-8)}</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
            {article.analysis_summary && (
              <p className="text-muted-foreground text-sm">
                <strong>Análise da Helena:</strong> {article.analysis_summary}
              </p>
            )}
          </div>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Palavras-chave</h3>
              <div className="flex flex-wrap gap-1">
                {article.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Conteúdo do Artigo
            </h3>
            <div className="prose prose-sm max-w-none">
              <div 
                className="whitespace-pre-wrap text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </div>

          {/* Similar Articles */}
          {article.similar_articles_found && article.similar_articles_found.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Artigos Similares Encontrados</h3>
              <div className="text-sm text-muted-foreground">
                A Helena encontrou {article.similar_articles_found.length} artigo(s) com conteúdo similar, 
                mas decidiu criar um novo artigo baseado nas especificidades deste ticket.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
