
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { toast } from 'sonner';

export const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const { searchKnowledge, isSearching, searchResults, lastQuery } = useSemanticSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Digite algo para buscar');
      return;
    }

    try {
      await searchKnowledge(query);
      
      if (searchResults.length === 0) {
        toast.info('Nenhum artigo relevante encontrado', {
          description: 'Tente ajustar sua busca ou criar um novo artigo.'
        });
      } else {
        toast.success(`${searchResults.length} artigos encontrados`, {
          description: 'Resultados ordenados por relevância'
        });
      }
    } catch (error) {
      console.error('Erro na busca semântica:', error);
      toast.error('Erro na busca', {
        description: 'Tente novamente em alguns instantes'
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="border-purple-intense/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-deep">
            <Sparkles className="h-5 w-5 text-purple-intense" />
            Busca Inteligente
          </CardTitle>
          <CardDescription>
            Use inteligência artificial para encontrar artigos relevantes baseados no contexto da sua pergunta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-deep/60" />
              <Input
                placeholder="Ex: Como resolver problema de login? Como configurar integração?"
                className="pl-9 border-turquoise-vibrant/20 focus:border-turquoise-vibrant"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching || !query.trim()}
              className="bg-gradient-to-r from-turquoise-vibrant to-purple-intense hover:from-turquoise-vibrant/90 hover:to-purple-intense/90"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Buscando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {lastQuery && (
        <div>
          <h3 className="text-lg font-semibold text-blue-deep mb-4">
            Resultados para: "{lastQuery}"
            {searchResults.length > 0 && (
              <span className="text-sm font-normal text-blue-deep/70 ml-2">
                ({searchResults.length} artigos encontrados)
              </span>
            )}
          </h3>

          {searchResults.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="py-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-blue-deep/50 opacity-50" />
                <h4 className="mt-4 text-lg font-medium text-blue-deep">
                  Nenhum resultado encontrado
                </h4>
                <p className="text-blue-deep/70 mt-2">
                  Tente usar outras palavras-chave ou criar um novo artigo sobre este tópico.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchResults.map((article) => (
                <Card key={article.id} className="border-turquoise-vibrant/20 hover:shadow-modern-lg transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-deep flex items-center gap-2">
                          {article.title}
                          <Badge 
                            variant="secondary" 
                            className="bg-purple-intense/10 text-purple-intense border-purple-intense/20"
                          >
                            {article.relevanceScore}% relevante
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1 text-blue-deep/60 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Atualizado em {formatDate(article.updatedAt)}
                        </CardDescription>
                      </div>
                      <Badge variant={article.isPublic ? "default" : "secondary"}>
                        {article.isPublic ? "Público" : "Interno"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-deep/80 line-clamp-3 mb-4">
                      {article.content.split("\n\n")[0]}
                    </p>
                    
                    {article.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.keywords.slice(0, 5).map((keyword) => (
                          <Badge key={keyword} variant="outline" className="bg-turquoise-vibrant/5 border-turquoise-vibrant/20 text-blue-deep text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {article.keywords.length > 5 && (
                          <Badge variant="outline" className="bg-turquoise-vibrant/5 border-turquoise-vibrant/20 text-blue-deep text-xs">
                            +{article.keywords.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
