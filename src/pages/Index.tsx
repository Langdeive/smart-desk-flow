
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-6">HelpDesk IA</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Plataforma de helpdesk inteligente para pequenas e médias empresas, automatizando o atendimento ao cliente com IA.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Crie Tickets</CardTitle>
              <CardDescription>
                Registre e acompanhe todas as solicitações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Submeta solicitações via web, email ou WhatsApp. Todas centralizadas em um só lugar.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/tickets/new")} className="w-full">Criar Ticket</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resolução Inteligente</CardTitle>
              <CardDescription>
                IA que analisa e resolve problemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nosso sistema automaticamente categoriza e sugere soluções utilizando processamento de linguagem natural.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/knowledge")} variant="outline" className="w-full">Base de Conhecimento</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Suporte Multi-Canal</CardTitle>
              <CardDescription>
                Atendimento unificado e eficiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Mantenha todos os canais de comunicação integrados em uma única plataforma de fácil gerenciamento.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/login")} variant="secondary" className="w-full">Acessar Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={() => navigate("/register")} size="lg">
            Começar Agora
          </Button>
          <Button onClick={() => navigate("/login")} variant="outline" size="lg">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
