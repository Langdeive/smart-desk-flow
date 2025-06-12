
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X } from 'lucide-react';
import { PendingArticle, ApproveArticleData } from '@/types/helena';

interface ArticleApprovalDialogProps {
  article: PendingArticle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (approvalData: ApproveArticleData) => void;
  isApproving?: boolean;
}

export function ArticleApprovalDialog({
  article,
  open,
  onOpenChange,
  onApprove,
  isApproving = false
}: ArticleApprovalDialogProps) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [keywords, setKeywords] = useState(article.keywords.join(', '));
  const [isPublic, setIsPublic] = useState(true);

  const handleApprove = () => {
    const approvalData: ApproveArticleData = {
      final_title: title !== article.title ? title : undefined,
      final_content: content !== article.content ? content : undefined,
      final_keywords: keywords !== article.keywords.join(', ') 
        ? keywords.split(',').map(k => k.trim()).filter(k => k) 
        : undefined,
      is_public: isPublic
    };

    onApprove(approvalData);
  };

  const hasChanges = 
    title !== article.title || 
    content !== article.content || 
    keywords !== article.keywords.join(', ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Revisar e Aprovar Artigo
            {hasChanges && (
              <Badge variant="secondary">Modificado</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Original article info */}
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <strong>Artigo gerado pela Helena</strong> • 
            Confiança: {(article.confidence_score * 100).toFixed(0)}% • 
            Ticket #{article.ticket_id.slice(-8)}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="palavra1, palavra2, palavra3"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conteúdo do artigo"
              rows={12}
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              {content.length} caracteres
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Artigo público</Label>
              <div className="text-sm text-muted-foreground">
                Tornar este artigo visível na base de conhecimento pública
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Analysis summary */}
          {article.analysis_summary && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <strong className="text-sm">Análise da Helena:</strong>
              <p className="text-sm mt-1">{article.analysis_summary}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving || !title.trim() || !content.trim()}
          >
            {isApproving ? (
              <>Aprovando...</>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar e Publicar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
