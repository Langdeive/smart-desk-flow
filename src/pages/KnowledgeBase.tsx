
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Lightbulb, Edit, Book, ArrowUpRight } from "lucide-react";
import { KnowledgeArticle } from "@/types";

// Dados mockados para demonstração - serão substituídos pela integração com Supabase
const getMockArticles = (): KnowledgeArticle[] => {
  return [
    {
      id: "1",
      title: "Como resetar sua senha",
      content: "Para resetar sua senha, siga os passos abaixo:\n\n1. Acesse a página de login\n2. Clique em 'Esqueci minha senha'\n3. Informe seu e-mail cadastrado\n4. Siga as instruções enviadas para seu e-mail",
      keywords: ["senha", "reset", "login", "acesso"],
      companyId: "company1",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isPublic: true,
    },
    {
      id: "2",
      title: "Erro ao exportar relatórios",
      content: "Se você está enfrentando problemas ao exportar relatórios, verifique:\n\n1. Se você tem permissões para exportar\n2. Se o relatório contém dados válidos\n3. Se você está usando um navegador atualizado\n\nSe o problema persistir, tente limpar o cache do navegador e tentar novamente.",
      keywords: ["exportar", "relatório", "erro", "permissões"],
      companyId: "company1",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isPublic: true,
      ticketId: "123",
    },
    {
      id: "3",
      title: "Como configurar integrações com APIs externas",
      content: "Para configurar integrações com APIs externas, você precisará:\n\n1. Obter as credenciais de API do serviço externo\n2. Acessar a seção de Integrações nas configurações\n3. Adicionar uma nova integração\n4. Inserir as credenciais e configurar os endpoints\n5. Testar a conexão antes de ativar\n\nCertifique-se de que os IPs do nosso serviço estão na whitelist do provedor da API.",
      keywords: ["api", "integração", "configuração", "externos", "credenciais"],
      companyId: "company1",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isPublic: false,
    },
  ];
};

const KnowledgeBase = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(getMockArticles());
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"all" | "public" | "internal">("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesView =
      viewType === "all" ||
      (viewType === "public" && article.isPublic) ||
      (viewType === "internal" && !article.isPublic);
    
    return matchesSearch && matchesView;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de conhecimento para atendimento automatizado
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Artigo</DialogTitle>
              <DialogDescription>
                Adicione um novo artigo à base de conhecimento.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  placeholder="Insira um título claro e descritivo"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descreva o problema e a solução em detalhes. Use formatação markdown se necessário."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="keywords" className="text-sm font-medium">
                  Palavras-chave
                </label>
                <Input
                  id="keywords"
                  placeholder="Adicione palavras-chave separadas por vírgula"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="public" className="text-sm font-medium">
                  Disponível publicamente
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Artigo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setViewType("all")}>
            Todos os Artigos
          </TabsTrigger>
          <TabsTrigger value="public" onClick={() => setViewType("public")}>
            Artigos Públicos
          </TabsTrigger>
          <TabsTrigger value="internal" onClick={() => setViewType("internal")}>
            Artigos Internos
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Nenhum artigo encontrado</h3>
          <p className="text-muted-foreground mt-2">
            Tente ajustar sua busca ou criar um novo artigo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Atualizado em {formatDate(article.updatedAt)}
                    </CardDescription>
                  </div>
                  {article.isPublic ? (
                    <Badge variant="secondary" className="ml-2">
                      Público
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2">
                      Interno
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.content.split("\n\n")[0]}
                </p>
                
                {article.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="bg-muted">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {article.ticketId && (
                  <div className="mt-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      <Book className="mr-1 h-3 w-3" />
                      Gerado de ticket
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button className="flex-1">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
