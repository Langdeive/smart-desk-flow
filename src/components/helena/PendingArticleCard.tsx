
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bot, 
  FileText,
  Edit,
  Eye
} from 'lucide-react';
import { PendingArticle, ApproveArticleData } from '@/types/helena';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArticlePreviewDialog } from './ArticlePreviewDialog';
import { ArticleApprovalDialog } from './ArticleApprovalDialog';
import { ArticleRejectionDialog } from './ArticleRejectionDialog';

interface PendingArticleCardProps {
  article: PendingArticle;
  onApprove: (approvalData: ApproveArticleData) => void;
  onReject: (reason: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function PendingArticleCard({
  article,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false
}: PendingArticleCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [rejectionOpen, setRejectionOpen] = useState(false);

  const confidenceColor = article.confidence_score >= 0.8 
    ? 'bg-green-100 text-green-800' 
    : article.confidence_score >= 0.6 
    ? 'bg-yellow-100 text-yellow-800' 
    : 'bg-red-100 text-red-800';

  const timeAgo = formatDistanceToNow(new Date(article.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Helena • {timeAgo}
                </span>
                <Badge className={confidenceColor}>
                  {(article.confidence_score * 100).toFixed(0)}% confiança
                </Badge>
              </div>
              <h3 className="font-semibold text-lg leading-tight mb-2">
                {article.title}
              </h3>
              {article.analysis_summary && (
                <p className="text-sm text-muted-foreground">
                  {article.analysis_summary}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {article.keywords.slice(0, 5).map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {article.keywords.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.keywords.length - 5} mais
                  </Badge>
                )}
              </div>
            )}

            {/* Similar Articles Info */}
            {article.similar_articles_found && article.similar_articles_found.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <FileText className="h-4 w-4 inline mr-1" />
                {article.similar_articles_found.length} artigo(s) similar(es) encontrado(s)
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setApprovalOpen(true)}
                disabled={isApproving || isRejecting}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar & Aprovar
              </Button>

              <Button
                size="sm"
                onClick={() => onApprove({})}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Aprovar
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRejectionOpen(true)}
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Rejeitar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ArticlePreviewDialog
        article={article}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <ArticleApprovalDialog
        article={article}
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        onApprove={onApprove}
        isApproving={isApproving}
      />

      <ArticleRejectionDialog
        open={rejectionOpen}
        onOpenChange={setRejectionOpen}
        onReject={onReject}
        isRejecting={isRejecting}
      />
    </>
  );
}
