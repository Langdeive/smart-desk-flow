
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { KnowledgeArticle } from '@/types';
import { KnowledgeArticleInput } from '@/hooks/useKnowledgeArticles';

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: KnowledgeArticle | null;
  onSave: (data: KnowledgeArticleInput) => Promise<void>;
  isPending: boolean;
}

export const ArticleDialog: React.FC<ArticleDialogProps> = ({
  open,
  onOpenChange,
  article,
  onSave,
  isPending,
}) => {
  const [formData, setFormData] = useState<KnowledgeArticleInput>({
    title: '',
    content: '',
    keywords: [],
    isPublic: true,
  });
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        keywords: article.keywords,
        isPublic: article.isPublic,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        keywords: [],
        isPublic: true,
      });
    }
    setKeywordInput('');
  }, [article, open]);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim().toLowerCase()]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Editar Artigo' : 'Novo Artigo'}
          </DialogTitle>
          <DialogDescription>
            {article ? 'Atualize as informações do artigo.' : 'Crie um novo artigo para a base de conhecimento.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-blue-deep">
              Título *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite um título claro e descritivo"
              className="border-turquoise-vibrant/20 focus:border-turquoise-vibrant"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-blue-deep">
              Conteúdo *
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Descreva o problema e a solução em detalhes..."
              className="min-h-[200px] border-turquoise-vibrant/20 focus:border-turquoise-vibrant"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-deep">
              Palavras-chave
            </label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordInputKeyPress}
                placeholder="Digite uma palavra-chave e pressione Enter"
                className="border-turquoise-vibrant/20 focus:border-turquoise-vibrant"
              />
              <Button 
                type="button" 
                onClick={handleAddKeyword}
                variant="outline"
                disabled={!keywordInput.trim()}
              >
                Adicionar
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => handleRemoveKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-turquoise-vibrant/5 to-purple-intense/5 rounded-lg border border-turquoise-vibrant/20">
            <div className="space-y-1">
              <label htmlFor="public" className="text-sm font-medium text-blue-deep">
                Artigo Público
              </label>
              <p className="text-xs text-blue-deep/70">
                Artigos públicos podem ser acessados por clientes via portal de autoatendimento
              </p>
            </div>
            <Switch
              id="public"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !formData.title.trim() || !formData.content.trim()}>
              {isPending ? 'Salvando...' : (article ? 'Atualizar' : 'Criar Artigo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
