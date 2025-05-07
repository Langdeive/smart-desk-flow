
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-a-50 via-background to-primary/5">
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl mb-6 gradient-text">
              HelpDesk IA
            </h1>
            <p className="text-2xl text-muted-foreground mb-10">
              Atendimento inteligente para sua empresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary-a to-primary shadow-md hover:shadow-lg transition-all">
                <Link to="/selecionar-plano" className="px-6 py-3">
                  Começar agora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-sm hover:shadow transition-all">
                <Link to="/login" className="px-6 py-3">Acessar minha conta</Link>
              </Button>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Check className="h-5 w-5" />}
              title="Atendimento ágil"
              description="Responda automaticamente perguntas comuns e agilize o atendimento com IA."
            />

            <FeatureCard
              icon={<Check className="h-5 w-5" />}
              title="Automação inteligente"
              description="Categorize tickets automaticamente e direcione para os agentes certos."
            />

            <FeatureCard
              icon={<Check className="h-5 w-5" />}
              title="Análises avançadas" 
              description="Insights e relatórios detalhados sobre o desempenho do seu atendimento."
            />
          </div>

          <div className="mt-36 p-8 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Escolha o plano ideal para sua empresa e revolucione seu atendimento.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary-a to-primary shadow-md hover:shadow-lg transition-all px-6 py-3">
              <Link to="/selecionar-plano">Ver planos disponíveis</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/50 shadow-md hover:shadow-lg transition-all hover:translate-y-[-4px]">
      <div className="mb-4 p-4 bg-gradient-to-br from-primary-a/20 to-primary/20 rounded-full">
        <div className="text-primary-a">
          {icon}
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
