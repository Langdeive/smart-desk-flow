
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Plus, Lightbulb, Edit, Book, ArrowUpRight, Trash2 } from "lucide-react";
import { useKnowledgeArticles } from "@/hooks/useKnowledgeArticles";
import { ArticleDialog } from "@/components/knowledge/ArticleDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { KnowledgeArticle } from "@/types";
import { toast } from "sonner";

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"all" | "public" | "internal">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const { articles, isLoading, error, createArticle, updateArticle, deleteArticle } = useKnowledgeArticles(debouncedSearch);

  const filteredArticles = articles.filter((article) => {
    const matchesView =
      viewType === "all" ||
      (viewType === "public" && article.isPublic) ||
      (viewType === "internal" && !article.isPublic);
    
    return matchesView;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setDialogOpen(true);
  };

  const handleEditArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setDialogOpen(true);
  };

  const handleSaveArticle = async (data: any) => {
    try {
      if (selectedArticle) {
        await updateArticle.mutateAsync({ id: selectedArticle.id, ...data });
        toast.success("Artigo atualizado com sucesso!");
      } else {
        await createArticle.mutateAsync(data);
        toast.success("Artigo criado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao salvar artigo. Tente novamente.");
      throw error;
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success("Artigo excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir artigo. Tente novamente.");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="border border-red-alert/20 rounded-lg p-6 bg-red-alert/10 text-red-alert">
          <h3 className="text-lg font-medium mb-2">Erro ao carregar artigos</h3>
          <p>Ocorreu um erro ao carregar os artigos. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-deep">Base de Conhecimento</h1>
          <p className="text-blue-deep/70">
            Gerencie sua base de conhecimento para atendimento automatizado
          </p>
        </div>
        
        <Button onClick={handleCreateArticle}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-deep/60" />
          <Input
            placeholder="Buscar artigos por título, conteúdo ou palavras-chave..."
            className="pl-9 border-turquoise-vibrant/20 focus:border-turquoise-vibrant"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-gradient-to-r from-turquoise-vibrant/10 to-purple-intense/10 border border-turquoise-vibrant/20">
          <TabsTrigger 
            value="all" 
            onClick={() => setViewType("all")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise-vibrant data-[state=active]:to-purple-intense data-[state=active]:text-white"
          >
            Todos os Artigos ({articles.length})
          </TabsTrigger>
          <TabsTrigger 
            value="public" 
            onClick={() => setViewType("public")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise-vibrant data-[state=active]:to-purple-intense data-[state=active]:text-white"
          >
            Artigos Públicos ({articles.filter(a => a.isPublic).length})
          </TabsTrigger>
          <TabsTrigger 
            value="internal" 
            onClick={() => setViewType("internal")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise-vibrant data-[state=active]:to-purple-intense data-[state=active]:text-white"
          >
            Artigos Internos ({articles.filter(a => !a.isPublic).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-deep bg-gradient-to-r from-turquoise-vibrant/10 to-purple-intense/10">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-turquoise-vibrant" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando artigos...
          </div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-blue-deep/50 opacity-50" />
          <h3 className="mt-4 text-lg font-medium text-blue-deep">Nenhum artigo encontrado</h3>
          <p className="text-blue-deep/70 mt-2">
            {searchTerm ? 'Tente ajustar sua busca ou criar um novo artigo.' : 'Comece criando seu primeiro artigo.'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateArticle} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Artigo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="h-full flex flex-col border-turquoise-vibrant/20 shadow-modern hover:shadow-modern-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-blue-deep line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="mt-1 text-blue-deep/60">
                      Atualizado em {formatDate(article.updatedAt)}
                    </CardDescription>
                  </div>
                  <Badge variant={article.isPublic ? "default" : "secondary"} className="ml-2 shrink-0">
                    {article.isPublic ? "Público" : "Interno"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <p className="text-sm text-blue-deep/80 line-clamp-3">
                  {article.content.split("\n\n")[0]}
                </p>
                
                {article.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="bg-turquoise-vibrant/5 border-turquoise-vibrant/20 text-blue-deep text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {article.keywords.length > 3 && (
                      <Badge variant="outline" className="bg-turquoise-vibrant/5 border-turquoise-vibrant/20 text-blue-deep text-xs">
                        +{article.keywords.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditArticle(article)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-alert border-red-alert/20 hover:bg-red-alert hover:text-white hover:border-red-alert"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir artigo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o artigo "{article.title}"? 
                          Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteArticle(article.id)}
                          className="bg-red-alert text-white hover:bg-red-alert/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={selectedArticle}
        onSave={handleSaveArticle}
        isPending={createArticle.isPending || updateArticle.isPending}
      />
    </div>
  );
};

export default KnowledgeBase;
