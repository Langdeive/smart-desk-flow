
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          HelpDesk IA: Atendimento inteligente para sua empresa
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Plataforma completa de suporte ao cliente com inteligência artificial para automatizar respostas,
          categorizar tickets e fornecer insights valiosos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/selecionar-plano">
              Começar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Acessar minha conta</Link>
          </Button>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-primary/10 rounded-full">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Atendimento ágil</h2>
          <p className="text-muted-foreground">
            Responda automaticamente perguntas comuns e agilize o atendimento com IA.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-primary/10 rounded-full">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Automação inteligente</h2>
          <p className="text-muted-foreground">
            Categorize tickets automaticamente e direcione para os agentes certos.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-primary/10 rounded-full">
            <svg
              className="h-10 w-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Análises avançadas</h2>
          <p className="text-muted-foreground">
            Insights e relatórios detalhados sobre o desempenho do seu atendimento.
          </p>
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Escolha o plano ideal para sua empresa e comece a revolucionar seu atendimento.
        </p>
        <Button asChild size="lg">
          <Link to="/selecionar-plano">Ver planos disponíveis</Link>
        </Button>
      </div>
    </div>
  );
}
