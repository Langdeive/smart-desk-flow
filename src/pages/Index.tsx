import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Clock, CheckCircle, BarChart, MessageCircle, Mail, Search, PanelLeft, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Logo from '@/components/ui/logo';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/common/Section';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-light via-white to-gray-light">
      <Navbar />
      <div className="pt-20 w-full">
        
        {/* Hero Section Modernizado */}
        <section className="w-full py-20 section-modern overflow-hidden">
          <div className="decorative-dots absolute inset-0 opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8 animate-slide-in-up">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-secondary text-white text-sm font-medium animate-pulse-glow">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by AI
                </div>
                
                <div>
                  <h1 className="text-4xl lg:text-6xl font-outfit font-bold mb-6 leading-tight">
                    Tickets resolvidos antes mesmo de chegarem ao seu 
                    <span className="gradient-text block mt-2">time</span>
                  </h1>
                  <p className="text-xl text-gray-medium leading-relaxed max-w-xl">
                    SolveFlow transforma seu suporte com IA que classifica, resolve e aprende automaticamente, 
                    escalando sua operação sem aumentar custos.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="modern-button bg-gradient-primary text-white shadow-glow px-8 py-4 text-lg font-medium"
                  >
                    <Link to="/register" className="flex items-center">
                      Teste grátis por 14 dias 
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="modern-button border-2 border-turquoise-vibrant text-turquoise-vibrant hover:bg-turquoise-vibrant hover:text-white px-8 py-4 text-lg font-medium"
                  >
                    <Link to="/selecionar-plano">Ver demonstração</Link>
                  </Button>
                </div>
                
                <div className="flex items-center gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-outfit font-bold gradient-text">3K+</div>
                    <div className="text-sm text-gray-medium">Tickets resolvidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-outfit font-bold gradient-text">90%</div>
                    <div className="text-sm text-gray-medium">Automação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-outfit font-bold gradient-text">24h</div>
                    <div className="text-sm text-gray-medium">Setup</div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 blur-xl"></div>
                  <img 
                    src="/lovable-uploads/a9745599-7fd2-4a87-a7bf-e46917dec514.png" 
                    alt="Dashboard SolveFlow" 
                    className="relative z-10 w-full max-w-lg mx-auto rounded-2xl shadow-modern-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prova Social Modernizada */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center scroll-reveal">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="bg-green-success/10 text-green-success px-4 py-2 rounded-full font-medium text-sm border border-green-success/20">
                  +500 empresas confiam na SolveFlow
                </span>
              </div>
              <p className="text-lg text-gray-medium">
                Reduzindo tempo de resposta em <span className="font-semibold text-turquoise-vibrant">60%</span> para equipes de TI no Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Problema → Solução Modernizado */}
        <Section id="features" className="py-20 section-accent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-4xl lg:text-5xl font-outfit font-bold mb-6 gradient-text">
                Da sobrecarga à automação
              </h2>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
                Transformamos os maiores desafios do suporte em vantagens competitivas
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Problemas */}
              <div className="space-y-6 scroll-reveal">
                <h3 className="text-2xl font-outfit font-semibold text-red-alert mb-8 flex items-center">
                  <Clock className="h-6 w-6 mr-3" />
                  Problemas atuais
                </h3>
                
                <ProblemCard 
                  icon={<Mail className="h-6 w-6" />}
                  title="Volume crescente sem controle"
                  description="Tickets se acumulam mais rápido que a equipe consegue resolver"
                />
                
                <ProblemCard 
                  icon={<MessageCircle className="h-6 w-6" />}
                  title="Respostas lentas e inconsistentes"
                  description="Clientes esperam enquanto agentes procuram informações dispersas"
                />
                
                <ProblemCard 
                  icon={<Search className="h-6 w-6" />}
                  title="Conhecimento desperdiçado"
                  description="Soluções ficam na cabeça dos agentes sem virar processo"
                />
              </div>
              
              {/* Soluções */}
              <div className="space-y-6 scroll-reveal">
                <h3 className="text-2xl font-outfit font-semibold text-green-success mb-8 flex items-center">
                  <Zap className="h-6 w-6 mr-3" />
                  Nossa solução
                </h3>
                
                <SolutionCard 
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Triagem inteligente em segundos"
                  description="IA classifica e direciona cada ticket automaticamente, liberando 60% do tempo da equipe"
                />
                
                <SolutionCard 
                  icon={<PanelLeft className="h-6 w-6" />}
                  title="Respostas instantâneas e precisas"
                  description="Sistema consulta a base de conhecimento e gera respostas contextualizadas na hora"
                />
                
                <SolutionCard 
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Conhecimento que evolui sozinho"
                  description="Cada solução vira artigo automaticamente, enriquecendo a base continuamente"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Como Funciona Modernizado */}
        <Section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-4xl lg:text-5xl font-outfit font-bold mb-6">
                Como funciona na <span className="gradient-text">prática</span>
              </h2>
              <p className="text-xl text-gray-medium max-w-2xl mx-auto">
                4 passos simples para transformar seu suporte
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 scroll-reveal">
              <ProcessStep 
                number="1"
                title="Cliente abre o ticket"
                description="Via email, WhatsApp ou portal - sem instalar nada"
                icon={<Mail className="h-8 w-8" />}
              />
              
              <ProcessStep 
                number="2"
                title="Laura analisa e organiza"
                description="IA identifica o problema e coleta informações necessárias"
                icon={<Search className="h-8 w-8" />}
              />
              
              <ProcessStep 
                number="3"
                title="Ricardo sugere a solução"
                description="Busca na base viva e prepara resposta personalizada"
                icon={<Sparkles className="h-8 w-8" />}
              />
              
              <ProcessStep 
                number="4"
                title="Helena documenta tudo"
                description="Transforma a solução em conhecimento permanente"
                icon={<Shield className="h-8 w-8" />}
              />
            </div>
            
            <div className="text-center mt-16 scroll-reveal">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-primary text-white font-medium">
                <TrendingUp className="h-5 w-5 mr-2" />
                Resultado: 90% menos trabalho manual, respostas 10x mais rápidas
              </div>
            </div>
          </div>
        </Section>

        {/* Funcionalidades Visuais */}
        <Section className="py-20 section-accent overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-4xl lg:text-5xl font-outfit font-bold mb-6 gradient-text">
                Funcionalidades que fazem a diferença
              </h2>
              <p className="text-xl text-gray-medium max-w-2xl mx-auto">
                Tecnologia de ponta pensada para equipes que querem escalar
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 scroll-reveal">
                <FeatureHighlight 
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Triagem Inteligente"
                  description="Laura entende o contexto de cada chamado em segundos, classificando automaticamente por tipo, urgência e complexidade."
                  stats="60% redução no tempo de triagem"
                />
                
                <FeatureHighlight 
                  icon={<MessageCircle className="h-6 w-6" />}
                  title="Respostas Automáticas"
                  description="Ricardo consulta toda a base de conhecimento e gera respostas personalizadas, mantendo o tom da sua empresa."
                  stats="Precisão de 90% nas sugestões"
                />
                
                <FeatureHighlight 
                  icon={<TrendingUp className="h-6 w-6" />}
                  title="Base de Conhecimento Viva"
                  description="Helena transforma cada solução em artigo estruturado, criando uma biblioteca que cresce automaticamente."
                  stats="+200 artigos criados por mês"
                />
              </div>
              
              <div className="relative animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-secondary rounded-2xl opacity-20 blur-xl"></div>
                  <img 
                    src="/lovable-uploads/f8c16f45-5bec-4d68-b002-42962d124d55.png" 
                    alt="Equipe de IA trabalhando" 
                    className="relative z-10 w-full rounded-2xl shadow-modern-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Depoimentos - Mantendo iniciais */}
        <Section className="py-16 section-spacing-sm section-white">
          <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-10">O que nossos clientes dizem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-reveal">
            <Card className="shadow-md hover-card border border-[#E5E7EB]">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-primary-a-50 to-primary-b-50 text-xl font-bold text-primary-b">
                      A
                    </AvatarFallback>
                  </Avatar>
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
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-primary-b-50 to-primary-a-50 text-xl font-bold text-primary-b">
                      R
                    </AvatarFallback>
                  </Avatar>
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
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-primary-a-50 to-primary-b-50 text-xl font-bold text-primary-b">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">Marina, ByteWorks</h3>
                </div>
                <p className="text-[#4B5563] text-center">
                  "Os clientes notaram a diferença no primeiro dia. Respostas mais rápidas e sempre contextualizadas."
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Planos & Preços */}
        <Section id="plans" className="py-16 section-spacing section-alt">
          <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-4">Planos que crescem com sua empresa</h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Comece gratuitamente e atualize conforme necessário
          </p>
          
          <div className="flex justify-center mb-4">
            <span className="bg-primary-b/10 text-primary-b px-4 py-1 rounded-full font-medium text-sm">
              Trial gratuito por 14 dias
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto scroll-reveal">
            <Card className="shadow-md hover-card border border-[#E9D8FF]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-center mb-2">Trial</h3>
                <div className="text-3xl font-bold text-center mb-4 text-[#7B3DDB]">Grátis<span className="text-base font-normal text-muted-foreground"> • 14 dias</span></div>
                <ul className="space-y-2 mb-6">
                  <PlanFeature>50 tickets para testar</PlanFeature>
                  <PlanFeature>1 agente</PlanFeature>
                  <PlanFeature>Triagem inteligente Laura</PlanFeature>
                  <PlanFeature>Integração via e-mail</PlanFeature>
                  <PlanFeature>Base Viva e relatórios básicos</PlanFeature>
                </ul>
                <p className="text-xs text-muted-foreground text-center mt-4">Ao atingir 50 tickets: basta escolher um plano pago.</p>
                <Button asChild className="w-full mt-4 bg-primary-b hover:bg-[#7B3DDB] transition-colors">
                  <Link to="/register">Começar agora</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover-card border border-[#E9D8FF]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-center mb-2">Basic</h3>
                <div className="text-3xl font-bold text-center mb-4 text-[#7B3DDB]">R$ 99<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <ul className="space-y-2 mb-6">
                  <PlanFeature>100 tickets por mês</PlanFeature>
                  <PlanFeature>1 agente incluído</PlanFeature>
                  <PlanFeature>Triagem Laura + Respostas Ricardo</PlanFeature>
                  <PlanFeature>Dashboard unificado</PlanFeature>
                  <PlanFeature>Suporte por e-mail</PlanFeature>
                </ul>
                <p className="text-xs text-muted-foreground text-center mt-4">R$ 0,90 por ticket extra</p>
                <Button asChild className="w-full mt-4 bg-primary-b hover:bg-[#7B3DDB] transition-colors">
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
                <div className="text-3xl font-bold text-center mb-4 text-[#7B3DDB]">R$ 199<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <ul className="space-y-2 mb-6">
                  <PlanFeature>1 000 tickets por mês</PlanFeature>
                  <PlanFeature>Até 5 agentes</PlanFeature>
                  <PlanFeature>Triagem Laura + Respostas Ricardo</PlanFeature>
                  <PlanFeature>Integrações e-mail e WhatsApp</PlanFeature>
                  <PlanFeature>Relatórios avançados e Base Viva</PlanFeature>
                  <PlanFeature>Suporte prioritário</PlanFeature>
                </ul>
                <p className="text-xs text-muted-foreground text-center mt-4">R$ 0,50 por ticket extra</p>
                <Button asChild className="w-full mt-4 bg-primary-b hover:bg-[#7B3DDB] transition-colors">
                  <Link to="/selecionar-plano">Escolher plano</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            Sem cartão de crédito, cancele quando quiser.
          </p>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="py-16 section-spacing section-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-manrope text-center mb-12">Perguntas frequentes</h2>
            
            <Accordion type="single" collapsible className="space-y-4 scroll-reveal">
              <FaqItem question="Como funciona a Base Viva e posso editar os artigos gerados?">
                A cada ticket encerrado, a IA "Helena" cria um artigo interno com passo-a-passo e tags. Você pode revisar, editar título, anexar imagens ou transformar o artigo em tutorial público com um clique. Assim, o conhecimento fica padronizado e sempre atualizado.
              </FaqItem>
              
              <FaqItem question="Preciso instalar algo no servidor da minha empresa?">
                Não. SolveFlow é 100 % SaaS. Basta criar a conta, conectar seu e-mail de suporte ou ativar o formulário no portal. A integração com WhatsApp requer apenas o código da Meta Business.
              </FaqItem>
              
              <FaqItem question="Em quanto tempo posso começar a usar?">
                Menos de 15 min. Depois do cadastro, a plataforma importa seus e-mails de suporte mais recentes e já inicia a triagem automática.
              </FaqItem>
              
              <FaqItem question="Como a IA aprende nosso contexto ao longo do tempo?">
                Laura e Ricardo consultam os artigos criados por Helena e entendem os ajustes que você faz em cada ticket. Cada correção alimenta o modelo, reduzindo erros e melhorando as sugestões futuras.
              </FaqItem>
              
              <FaqItem question="O que acontece se eu ultrapassar o limite de tickets?">
                No Plano Basic, cada ticket extra custa R$ 0,90; no Pro, R$ 0,50. Você acompanha o consumo em tempo real e recebe alerta aos 80 % do limite.
              </FaqItem>
            </Accordion>
          </div>
        </Section>

        {/* CTA Final */}
        <Section className="py-12 section-spacing-sm section-alt">
          <div className="p-8 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm max-w-3xl mx-auto text-center scroll-reveal">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para transformar seu atendimento?</h2>
            <p className="text-lg text-[#4B5563] mb-8 readable-width mx-auto">
              Experimente gratuitamente por 14 dias e veja a diferença que a IA pode fazer para sua equipe.
            </p>
            <Button asChild size="lg" className="bg-primary-b hover:bg-[#7B3DDB] transition-colors shadow-md hover:shadow-lg px-8 py-3">
              <Link to="/register">Começar agora</Link>
            </Button>
          </div>
        </Section>

        {/* Footer */}
        <section className="py-12 section-white w-full">
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
    </div>
  );
}

// Componentes modernizados
function ProblemCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="modern-card border-l-4 border-red-alert bg-red-alert/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-alert/10 flex items-center justify-center text-red-alert">
          {icon}
        </div>
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-2 text-gray-dark">{title}</h3>
          <p className="text-gray-medium">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SolutionCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="modern-card border-l-4 border-green-success bg-green-success/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-success/10 flex items-center justify-center text-green-success">
          {icon}
        </div>
        <div>
          <h3 className="font-outfit font-semibold text-lg mb-2 text-gray-dark">{title}</h3>
          <p className="text-gray-medium">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="text-center space-y-4">
      <div className="relative mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow">
        {icon}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
          {number}
        </div>
      </div>
      <h3 className="font-outfit font-semibold text-lg text-gray-dark">{title}</h3>
      <p className="text-gray-medium text-sm">{description}</p>
    </div>
  );
}

function FeatureHighlight({ icon, title, description, stats }: { icon: React.ReactNode; title: string; description: string; stats: string }) {
  return (
    <div className="modern-card bg-white/60 backdrop-blur-sm p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-outfit font-semibold text-xl mb-3 text-gray-dark">{title}</h3>
          <p className="text-gray-medium mb-4">{description}</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-turquoise-vibrant/10 text-turquoise-vibrant text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            {stats}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ initial, name, company, testimonial, metric }: { initial: string; name: string; company: string; testimonial: string; metric: string }) {
  return (
    <div className="modern-card bg-white p-8 text-center">
      <Avatar className="h-16 w-16 mb-4 mx-auto">
        <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="mb-4">
        <h3 className="font-outfit font-semibold text-lg text-gray-dark">{name}</h3>
        <p className="text-turquoise-vibrant font-medium">{company}</p>
      </div>
      <p className="text-gray-medium mb-4 italic">"{testimonial}"</p>
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-success/10 text-green-success text-sm font-bold">
        {metric}
      </div>
    </div>
  );
}
