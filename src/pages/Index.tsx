import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock, CheckCircle, BarChart, MessageCircle, Mail, Search, PanelLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Logo from '@/components/ui/logo';
import { Navbar } from '@/components/layout/Navbar';
export default function Index() {
  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1
    });
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => {
      observer.observe(el);
    });
    return () => {
      scrollElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  return <div className="min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* Add padding to compensate for fixed navbar */}
        {/* Hero Section - Height reduced */}
        <section className="container mx-auto py-16 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center hero-gradient">
            <div className="space-y-6">
              <div className="readable-width">
                <h1 className="text-3xl md:text-4xl font-bold font-manrope tracking-tight mb-4">
                  Atendimento ágil sem contratar mais gente
                </h1>
                <p className="text-lg text-muted-foreground">
                  Centralize atendimentos, deixe a IA classificar chamados e transforme cada solução em conhecimento sem frear sua equipe.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary-b to-primary-b-600 shadow-md hover:shadow-lg transition-all">
                  <Link to="/register" className="px-6 py-3">
                    Teste grátis por 14 dias <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-a text-primary-a hover:bg-primary-a-50 shadow-sm hover:shadow transition-all">
                  <Link to="/selecionar-plano" className="px-6 py-3">Ver planos</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src="/lovable-uploads/ac74fffe-4ee3-4036-82bd-f6336fb9f963.png" alt="Support specialist" className="hero-dashboard-image h-80" />
            </div>
          </div>
        </section>

        {/* Prova Social */}
        <section className="bg-white py-8 section-spacing-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-b/10 text-primary-b px-4 py-1 rounded-full font-medium text-sm">
                  +3 000 tickets resolvidos
                </span>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Equipes de TI no Brasil já confiam na SolveFlow.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70 bg-gray-100 py-6 px-4 w-full rounded-lg">
                <img src="/lovable-uploads/logo-placeholder-1.png" alt="Cliente" className="h-8" />
                <img src="/lovable-uploads/logo-placeholder-2.png" alt="Cliente" className="h-8" />
                <img src="/lovable-uploads/logo-placeholder-3.png" alt="Cliente" className="h-8" />
                <img src="/lovable-uploads/logo-placeholder-4.png" alt="Cliente" className="h-8" />
              </div>
            </div>
          </div>
        </section>

        {/* Problema → Solução */}
        <section id="features" className="py-16 bg-alt-section section-spacing">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-12">Transforme problemas em soluções</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="problem-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-error/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <Mail className="text-error h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tickets vazios geram retrabalho.</h3>
                  <p className="text-muted-foreground">
                    Tempo perdido pedindo informações básicas que faltaram.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="problem-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-error/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <MessageCircle className="text-error h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Informações perdidas em e-mails.</h3>
                  <p className="text-muted-foreground">
                    Informações importantes se perdem em threads intermináveis.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="problem-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-error/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <Clock className="text-error h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Primeira resposta demora horas.</h3>
                  <p className="text-muted-foreground">
                    Clientes insatisfeitos com o tempo de espera para o primeiro contato.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="solution-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-success/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <Search className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Laura, nossa IA de triagem, pede prints e logs antes de o ticket chegar ao agente.</h3>
                  <p className="text-muted-foreground">
                    IA identifica informações faltantes e solicita automaticamente.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="solution-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-success/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <PanelLeft className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tudo chega num único painel com histórico completo e filtros inteligentes.</h3>
                  <p className="text-muted-foreground">
                    Histórico completo e contexto centralizado para resoluções mais rápidas.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="solution-card shadow-md hover-card">
                <CardContent className="pt-6">
                  <div className="mb-4 p-2 bg-success/10 rounded-full w-10 h-10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ricardo propõe a solução pronta em segundos; o agente só clica "enviar".</h3>
                  <p className="text-muted-foreground">
                    IA sugere respostas baseadas no histórico e no conhecimento acumulado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Funcionalidades-estrela */}
        <section className="py-16 section-spacing bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-4">Funcionalidades-estrela</h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 readable-width">
              Ferramentas poderosas que transformam seu atendimento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-reveal">
              <FeatureCard icon={<Search className="h-6 w-6" />} title="Triagem Inteligente" description="Prioriza e completa chamados automaticamente." />
              
              <FeatureCard icon={<MessageCircle className="h-6 w-6" />} title="Auto-respostas" description="Sugestões baseadas em casos já resolvidos." />
              
              <FeatureCard icon={<CheckCircle className="h-6 w-6" />} title="Base Viva" description="Helena transforma cada resolução em artigo pesquisável." />
              
              <FeatureCard icon={<BarChart className="h-6 w-6" />} title="Relatórios Smart" description="Tempo médio, gargalos e tendências em um clique." />
            </div>
            
            <div className="mt-10 scroll-reveal">
              <img src="/lovable-uploads/f8c16f45-5bec-4d68-b002-42962d124d55.png" alt="Equipe de IA - Laura, Ricardo e Helena" className="ai-agents-image w-full max-w-2xl mx-auto" />
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-16 bg-alt-section section-spacing-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-10">Como Funciona</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 scroll-reveal">
              <div className="flex flex-row md:flex-col items-center md:text-center">
                <div className="mr-4 md:mb-4 p-2 bg-gradient-to-br from-[#6EE7B7] to-[#93C5FD] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">O cliente abre o ticket.</h3>
                  <p className="text-sm text-muted-foreground">
                    E-mail ou portal; nada para instalar.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:text-center">
                <div className="mr-4 md:mb-4 p-2 bg-gradient-to-br from-[#6EE7B7] to-[#93C5FD] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Laura organiza e classifica.</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifica prioridade e coleta o que estiver faltando.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:text-center">
                <div className="mr-4 md:mb-4 p-2 bg-gradient-to-br from-[#6EE7B7] to-[#93C5FD] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ricardo sugere a solução.</h3>
                  <p className="text-sm text-muted-foreground">
                    Busca na base viva e entrega a resposta pronta.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:text-center">
                <div className="mr-4 md:mb-4 p-2 bg-gradient-to-br from-[#6EE7B7] to-[#93C5FD] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Agente aprova, Helena aprende.</h3>
                  <p className="text-sm text-muted-foreground">
                    Ticket resolvido; a solução vira conhecimento permanente.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12 readable-width mx-auto scroll-reveal">
              <p className="text-xl font-semibold font-manrope text-[#4B5563]">Menos idas e vindas, mais problemas resolvidos — tudo num fluxo só.</p>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-16 section-spacing-sm bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-10">O que nossos clientes dizem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-reveal">
              <Card className="shadow-md hover-card border border-[#E5E7EB]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-a-50 to-primary-b-50 mb-4"></div>
                    <h3 className="font-semibold">Ana, GoTech</h3>
                  </div>
                  <p className="text-[#4B5563] text-center">
                    "Reduzimos 30% do esforço de suporte em dois meses. A IA realmente entende nosso contexto técnico."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover-card border border-[#E5E7EB]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-b-50 to-primary-a-50 mb-4"></div>
                    <h3 className="font-semibold">Renato, DevCloud</h3>
                  </div>
                  <p className="text-[#4B5563] text-center">
                    "Hoje a triagem é automática; focamos nas soluções em vez de categorizar manualmente cada ticket."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover-card border border-[#E5E7EB]">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-a-50 to-primary-b-50 mb-4"></div>
                    <h3 className="font-semibold">Marina, ByteWorks</h3>
                  </div>
                  <p className="text-[#4B5563] text-center">
                    "Os clientes notaram a diferença no primeiro dia. Respostas mais rápidas e sempre contextualizadas."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Planos & Preços */}
        <section id="plans" className="py-16 bg-alt-section section-spacing">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-4">Planos que crescem com sua empresa</h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Comece gratuitamente e atualize conforme necessário
            </p>
            
            <div className="flex justify-center mb-4">
              <span className="bg-primary-b/10 text-primary-b px-4 py-1 rounded-full font-medium text-sm">
                Trial gratuito por 14 dias
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto scroll-reveal">
              <div></div>
              <Card className="shadow-md hover-card border border-[#E9D8FF]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-center mb-2">Basic</h3>
                  <div className="text-3xl font-bold text-center mb-4 text-[#7B3DDB]">R$ 197<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                  <ul className="space-y-2 mb-6">
                    <PlanFeature>Até 100 tickets/mês</PlanFeature>
                    <PlanFeature>2 agentes</PlanFeature>
                    <PlanFeature>Triagem automática</PlanFeature>
                    <PlanFeature>Integração com e-mail</PlanFeature>
                    <PlanFeature>Suporte por e-mail</PlanFeature>
                  </ul>
                  <Button asChild className="w-full bg-primary-b hover:bg-[#7B3DDB] transition-colors">
                    <Link to="/selecionar-plano">Escolher plano</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-md hover-card border-2 border-primary-b relative">
                <div className="absolute -top-3 right-0 left-0 mx-auto w-fit px-3 py-1 bg-primary-b text-white text-xs font-semibold rounded-full">
                  Mais popular
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-center mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-center mb-4 text-[#7B3DDB]">R$ 497<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                  <ul className="space-y-2 mb-6">
                    <PlanFeature>Até 1000 tickets/mês</PlanFeature>
                    <PlanFeature>Agentes ilimitados</PlanFeature>
                    <PlanFeature>Triagem + sugestões IA</PlanFeature>
                    <PlanFeature>Integração email + WhatsApp</PlanFeature>
                    <PlanFeature>Suporte prioritário</PlanFeature>
                    <PlanFeature>Relatórios avançados</PlanFeature>
                  </ul>
                  <Button asChild className="w-full bg-primary-b hover:bg-[#7B3DDB] transition-colors">
                    <Link to="/selecionar-plano">Escolher plano</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Sem cartão de crédito, cancele quando quiser.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 section-spacing bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-12">Perguntas frequentes</h2>
            
            <Accordion type="single" collapsible className="space-y-4 scroll-reveal">
              <FaqItem question="A IA fala português?">
                Sim! Nossa IA é treinada para entender perfeitamente o português e todas as nuances técnicas comuns em ambientes de TI.
              </FaqItem>
              
              <FaqItem question="Posso integrar ao meu CRM?">
                Oferecemos integrações com os principais CRMs do mercado. Para casos específicos, nossa API está disponível nos planos Pro.
              </FaqItem>
              
              <FaqItem question="Quanto tempo leva para implementar?">
                Menos de 1 dia. A configuração básica leva cerca de 15 minutos e a integração com seus canais existentes pode ser feita no mesmo dia.
              </FaqItem>
              
              <FaqItem question="Como a IA aprende nossa base de conhecimento?">
                A IA analisa seus tickets resolvidos e documentação existente. A cada ticket resolvido, o sistema fica mais inteligente e específico para seu contexto.
              </FaqItem>
              
              <FaqItem question="É seguro compartilhar dados de clientes?">
                Absolutamente. Seguimos todas as normas da LGPD, usamos criptografia de ponta a ponta e não utilizamos dados de clientes para treinar modelos gerais.
              </FaqItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 bg-alt-section section-spacing-sm">
          <div className="container mx-auto px-4">
            <div className="p-8 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm max-w-3xl mx-auto text-center scroll-reveal">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para transformar seu atendimento?</h2>
              <p className="text-lg text-[#4B5563] mb-8 readable-width mx-auto">
                Experimente gratuitamente por 14 dias e veja a diferença que a IA pode fazer para sua equipe.
              </p>
              <Button asChild size="lg" className="bg-primary-b hover:bg-[#7B3DDB] transition-colors shadow-md hover:shadow-lg px-8 py-3">
                <Link to="/register">Começar agora</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <Logo glow={true} />
                <p className="text-sm text-muted-foreground mt-2">
                  Criado pela Orbitus • © 2025
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Produto</h4>
                  <ul className="space-y-2">
                    <li><Link to="/selecionar-plano" className="text-[#4B5563] hover:text-foreground transition-colors">Planos</Link></li>
                    <li><a href="#features" className="text-[#4B5563] hover:text-foreground transition-colors">Funcionalidades</a></li>
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Integrações</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Empresa</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Sobre nós</a></li>
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Blog</a></li>
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Carreiras</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Termos</a></li>
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Privacidade</a></li>
                    <li><a href="#" className="text-[#4B5563] hover:text-foreground transition-colors">Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>;
}

// Keep feature card component
function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border/50 shadow-md hover-card">
      <div className="mb-4 p-4 bg-gradient-to-br from-primary-a/20 to-primary-b/20 rounded-full">
        <div className="text-primary-a">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#4B5563]">
        {description}
      </p>
    </div>;
}

// Keep plan feature component
function PlanFeature({
  children
}: {
  children: React.ReactNode;
}) {
  return <li className="flex items-center">
      <Check className="h-5 w-5 mr-2 text-primary-a flex-shrink-0" />
      <span>{children}</span>
    </li>;
}

// Keep FAQ item component
function FaqItem({
  question,
  children
}: {
  question: string;
  children: React.ReactNode;
}) {
  return <AccordionItem value={question.replace(/\s/g, '-').toLowerCase()} className="border rounded-lg px-4">
      <AccordionTrigger className="text-left font-semibold py-4">{question}</AccordionTrigger>
      <AccordionContent className="pb-4 text-[#4B5563]">
        {children}
      </AccordionContent>
    </AccordionItem>;
}