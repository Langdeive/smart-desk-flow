import { useState } from "react";
import { 
  MessageSquare, Target, Rocket, Check, ArrowRight, 
  Phone, Mail, Building2, ChevronDown, Users, Zap,
  Brain, Link2, BarChart3, Settings, Clock, Shield,
  ShoppingBag, Briefcase, Laptop, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    company: "",
    interest: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Webhook placeholder
    console.log("Form submitted:", formData);
    alert("Obrigado! Entraremos em contato em breve.");
  };

  const whatsappLink = "https://wa.me/5511999999999?text=Olá! Quero saber mais sobre os agentes de IA.";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold text-gradient">Solveflow</a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
              <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <Button asChild className="bg-solveflow-green hover:bg-solveflow-green/90">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Falar Agora
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in">
              <div className="flex flex-col gap-4">
                <a href="#produtos" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Produtos</a>
                <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Como Funciona</a>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <Button asChild className="bg-solveflow-green hover:bg-solveflow-green/90 w-full">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    💬 Falar Agora
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-display font-extrabold leading-tight mb-6">
                Transforme seu WhatsApp em{" "}
                <span className="text-solveflow-green">Máquina de Vendas</span>{" "}
                e Atendimento com IA
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Agentes de IA que atendem clientes, qualificam leads e reduzem churn. 
                Integrados ao seu CRM. <strong>Setup em 1 semana.</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  size="lg" 
                  className="bg-solveflow-green hover:bg-solveflow-green/90 text-white text-lg px-8 py-6 shadow-glow-green"
                  asChild
                >
                  <a href="#contato">
                    Falar com Especialista
                    <ArrowRight className="ml-2" size={20} />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    💬 Mandar Mensagem Agora
                  </a>
                </Button>
              </div>
              <p className="text-sm text-blue-200">
                Não tem CRM? <span className="underline">Nós implantamos o Kommo pra você.</span>
              </p>
            </div>
            
            {/* WhatsApp Mockup */}
            <div className="hidden lg:block animate-float">
              <div className="bg-white rounded-3xl shadow-strong p-4 max-w-sm mx-auto">
                <div className="bg-green-600 rounded-t-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Agente Solveflow</p>
                    <p className="text-green-100 text-xs">Online agora</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 space-y-3 min-h-[300px]">
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-800">Olá! 👋 Sou o assistente virtual. Como posso ajudar você hoje?</p>
                  </div>
                  <div className="bg-green-500 rounded-lg p-3 shadow-sm max-w-[80%] ml-auto">
                    <p className="text-sm text-white">Quero saber sobre os preços</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                    <p className="text-sm text-gray-800">Perfeito! Qual produto te interessa mais: Atendimento, Qualificação de Leads ou Redução de Churn?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-section-lg bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Seu Time Perde Horas Todo Dia com Mensagens no WhatsApp?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: "😰",
                title: "Atendimento Sobrecarregado",
                description: "Sua equipe não dá conta do volume de mensagens. Clientes esperam horas por resposta e ficam frustrados."
              },
              {
                icon: "📉",
                title: "Leads Desperdiçados",
                description: "Leads entram no WhatsApp e se perdem. Sem qualificação, sem follow-up, sem conversão."
              },
              {
                icon: "🚪",
                title: "Clientes Cancelando",
                description: "Sem acompanhamento proativo, clientes vão embora sem você perceber até ser tarde demais."
              }
            ].map((problem, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-8 shadow-soft hover-lift border border-border"
              >
                <span className="text-5xl mb-4 block">{problem.icon}</span>
                <h3 className="text-h4 font-semibold text-foreground mb-3">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Tem algum desses problemas? Podemos resolver.</p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <a href="#contato">
                Quero Resolver Isso
                <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-6">
              Agentes de IA que Trabalham{" "}
              <span className="text-gradient">24/7</span> pelo Seu Time
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossos agentes são mais do que chatbots. São assistentes inteligentes que entendem contexto, 
              integram com seu CRM e aprendem com cada interação. Eles respondem, qualificam e 
              acompanham seus clientes automaticamente — liberando seu time para focar no que realmente importa.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-section-lg bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Escolha o Agente Ideal para o Seu Negócio
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Agent 1 - Atendimento */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="text-solveflow-blue" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-3">Agente de Atendimento</h3>
                <p className="text-muted-foreground mb-4">
                  Responde perguntas frequentes, resolve dúvidas e direciona casos complexos para humanos.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> E-commerce, clínicas, escolas, serviços
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-muted-foreground">✓ Respostas 80% mais rápidas</p>
                  <p className="text-sm text-muted-foreground">✓ Atendimento 24/7</p>
                  <p className="text-sm text-muted-foreground">✓ Redução de 60% no volume humano</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                  <p className="text-2xl font-bold text-foreground">R$ 2.500 <span className="text-sm font-normal text-muted-foreground">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-blue">+ R$ 497/mês</p>
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Setup completo</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Integração CRM</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Suporte mensal</p>
                </div>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full bg-solveflow-blue hover:bg-solveflow-blue/90" asChild>
                  <a href="#contato">Quero Automatizar Atendimento</a>
                </Button>
              </div>
            </div>

            {/* Agent 2 - SDR */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-solveflow-purple" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-3">Agente SDR</h3>
                <p className="text-muted-foreground mb-4">
                  Qualifica leads automaticamente, agenda reuniões e alimenta seu pipeline de vendas.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> Consultorias, SaaS, imobiliárias, serviços B2B
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-muted-foreground">✓ 3x mais leads qualificados</p>
                  <p className="text-sm text-muted-foreground">✓ Follow-up automático</p>
                  <p className="text-sm text-muted-foreground">✓ Agendamento inteligente</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                  <p className="text-2xl font-bold text-foreground">R$ 5.000 <span className="text-sm font-normal text-muted-foreground">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-purple">+ R$ 697/mês</p>
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Setup completo</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Integração CRM</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Scripts personalizados</p>
                </div>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90" asChild>
                  <a href="#contato">Quero Qualificar Leads</a>
                </Button>
              </div>
            </div>

            {/* Agent 3 - CS (Highlight) */}
            <div className="bg-white rounded-lg shadow-strong hover-lift border-2 border-solveflow-green overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-solveflow-green text-white text-center py-2 text-sm font-semibold">
                🏆 EXCLUSIVO SOLVEFLOW
              </div>
              <div className="p-8 pt-14">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Rocket className="text-solveflow-green" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-1">Agente CS</h3>
                <p className="text-sm text-solveflow-green font-semibold mb-3">SolveCS™</p>
                <p className="text-muted-foreground mb-4">
                  Monitora saúde do cliente, antecipa problemas e intervém proativamente para evitar cancelamentos.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> SaaS, assinaturas, serviços recorrentes
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-muted-foreground">✓ Redução de 40% no churn</p>
                  <p className="text-sm text-muted-foreground">✓ IA preditiva de risco</p>
                  <p className="text-sm text-muted-foreground">✓ Onboarding adaptativo</p>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                  <p className="text-2xl font-bold text-foreground">R$ 10.000 <span className="text-sm font-normal text-muted-foreground">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-green">+ R$ 1.497/mês</p>
                </div>
                <div className="mt-6 space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Setup completo</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Dashboard executivo</p>
                  <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Consultoria CS inclusa</p>
                </div>
              </div>
              <div className="px-8 pb-8">
                <Button className="w-full bg-solveflow-green hover:bg-solveflow-green/90" asChild>
                  <a href="#contato">Quero Reduzir Churn</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Package CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Quer os 3 Agentes Trabalhando Juntos?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Tenha uma operação completa de IA: atendimento, vendas e retenção integrados. 
              Desconto especial para pacotes completos.
            </p>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100" asChild>
              <a href="#contato">Solicitar Proposta de Pacote</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CS Highlight Section */}
      <section className="py-section-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                O Que Torna Nosso Agente de CS{" "}
                <span className="text-solveflow-green">o Melhor do Brasil</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Desenvolvido por especialistas em Customer Success com mais de 10 anos de experiência em retenção.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: <Brain className="text-solveflow-green" size={32} />,
                  title: "IA Preditiva",
                  description: "Analisa padrões de comportamento e identifica clientes em risco ANTES de cancelarem. Alertas automáticos para sua equipe agir no momento certo."
                },
                {
                  icon: <Link2 className="text-solveflow-green" size={32} />,
                  title: "Integração Profunda",
                  description: "Conecta com seu CRM, sistema de pagamentos e métricas de produto. Visão 360° do cliente em um só lugar."
                },
                {
                  icon: <Target className="text-solveflow-green" size={32} />,
                  title: "Onboarding Adaptativo",
                  description: "Guia cada cliente pelo processo ideal de ativação. Ajusta o fluxo baseado no comportamento e perfil do usuário."
                },
                {
                  icon: <BarChart3 className="text-solveflow-green" size={32} />,
                  title: "Dashboard Executivo",
                  description: "Métricas de retenção, health score, NPS e previsões de churn em tempo real. Dados para decisões estratégicas."
                },
                {
                  icon: <Settings className="text-solveflow-green" size={32} />,
                  title: "Sob Medida",
                  description: "Cada implementação é customizada para seu modelo de negócio. Não é solução de prateleira — é feito pra você."
                }
              ].map((feature, index) => (
                <div key={index} className="flex gap-6 items-start bg-white rounded-lg p-6 shadow-soft">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-h4 font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-solveflow-green text-white rounded-lg p-8 text-center">
              <p className="text-xl font-semibold mb-2">Resultado comprovado:</p>
              <p className="text-3xl font-bold mb-4">40% de redução no churn em média</p>
              <Button size="lg" className="bg-white text-solveflow-green hover:bg-gray-100" asChild>
                <a href="#contato">Agendar Consultoria de CS</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Kommo Section */}
      <section className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                  Não Tem CRM?{" "}
                  <span className="text-gradient">Sem Problema.</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Implantamos e Configuramos o Kommo pra Você
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  O Kommo é o CRM ideal para WhatsApp. Nós configuramos tudo: 
                  funis, automações, integrações e treinamento da equipe.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Configuração completa de funis de vendas",
                    "Integração com WhatsApp Business API",
                    "Automações de follow-up",
                    "Treinamento da equipe (2h)",
                    "Suporte de implantação por 30 dias"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="text-solveflow-green flex-shrink-0" size={20} />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Implantação</p>
                  <p className="text-4xl font-bold text-foreground">R$ 2.000</p>
                </div>
                <div className="text-center mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Planos Kommo</p>
                  <p className="text-lg font-semibold text-foreground">a partir de R$ 82/usuário/mês</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-center font-semibold text-yellow-800">
                    🎁 Bônus: 1 mês grátis de CRM
                  </p>
                </div>
                <Button className="w-full bg-solveflow-blue hover:bg-solveflow-blue/90" size="lg" asChild>
                  <a href="#contato">Quero CRM + Agente Juntos</a>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Já usa outro CRM? Também integramos com Pipedrive, HubSpot e outros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-section-lg bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Setup em 1 Semana. Sem Complicação.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Discovery",
                  time: "30 min",
                  description: "Entendemos seu negócio, processos atuais e objetivos."
                },
                {
                  step: "2",
                  title: "Setup Técnico",
                  time: "3-5 dias",
                  description: "Configuramos o agente, integrações e personalização."
                },
                {
                  step: "3",
                  title: "Testes",
                  time: "2 dias",
                  description: "Validamos cenários reais e ajustamos o que for necessário."
                },
                {
                  step: "4",
                  title: "Go Live",
                  time: "1 dia",
                  description: "Agente entra em produção. Acompanhamos os primeiros resultados."
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-solveflow-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-h4 font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-solveflow-blue font-medium mb-2">{item.time}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-solveflow-green hover:bg-solveflow-green/90" asChild>
              <a href="#contato">
                Começar Agora
                <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Por Que Não É Só Mais Um Chatbot
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Link2 className="text-solveflow-blue" size={32} />,
                title: "Integração Real com CRM",
                description: "Não só conecta — realmente usa os dados do CRM para personalizar cada interação."
              },
              {
                icon: <Brain className="text-solveflow-purple" size={32} />,
                title: "IA Contextual",
                description: "Entende histórico, perfil e momento do cliente. Respostas relevantes, não genéricas."
              },
              {
                icon: <Users className="text-solveflow-green" size={32} />,
                title: "Handoff Inteligente",
                description: "Sabe quando parar e passar para um humano. Com todo o contexto da conversa."
              },
              {
                icon: <Zap className="text-yellow-500" size={32} />,
                title: "Melhoria Contínua",
                description: "Aprende com cada interação. Fica mais inteligente com o tempo, automaticamente."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-h4 font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-section-lg bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Casos de Uso Reais
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBag className="text-pink-500" size={32} />,
                title: "E-commerce de Roupas",
                description: "Agente de atendimento responde dúvidas sobre tamanhos, trocas e entregas 24/7.",
                result: "Resultado: 70% das mensagens resolvidas sem humano"
              },
              {
                icon: <Briefcase className="text-solveflow-blue" size={32} />,
                title: "Consultoria B2B",
                description: "Agente SDR qualifica leads, agenda calls e mantém pipeline sempre cheio.",
                result: "Resultado: 3x mais reuniões agendadas por mês"
              },
              {
                icon: <Laptop className="text-solveflow-green" size={32} />,
                title: "SaaS de Gestão",
                description: "Agente CS monitora uso, identifica riscos e ativa clientes parados.",
                result: "Resultado: Churn caiu de 8% para 4,5% em 6 meses"
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-soft hover-lift border border-border">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {useCase.icon}
                </div>
                <h3 className="text-h4 font-semibold text-foreground mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                <p className="text-sm font-semibold text-solveflow-green">{useCase.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                Perguntas Frequentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "Quanto tempo leva para implementar?",
                  answer: "Em média, 1 semana. Desde a primeira conversa até o agente funcionando em produção. Projetos mais complexos podem levar até 2 semanas."
                },
                {
                  question: "Preciso ter conhecimento técnico?",
                  answer: "Não. Nós cuidamos de toda a parte técnica. Você só precisa nos dar acesso ao WhatsApp e CRM, e participar de uma call de alinhamento."
                },
                {
                  question: "O agente substitui minha equipe?",
                  answer: "Não. O agente complementa sua equipe, assumindo tarefas repetitivas. Casos complexos são automaticamente passados para humanos com todo o contexto."
                },
                {
                  question: "Funciona com qualquer CRM?",
                  answer: "Funcionamos nativamente com Kommo, Pipedrive e HubSpot. Para outros CRMs, avaliamos a integração caso a caso."
                },
                {
                  question: "E se o cliente quiser falar com um humano?",
                  answer: "O agente detecta essa intenção e faz o handoff imediatamente, passando todo o histórico da conversa para o atendente."
                },
                {
                  question: "Como funciona o pagamento?",
                  answer: "Setup é pago uma vez no início. Mensalidade é cobrada após o go-live. Aceitamos PIX, boleto e cartão."
                },
                {
                  question: "Tem contrato de fidelidade?",
                  answer: "Não. Você pode cancelar a qualquer momento com 30 dias de aviso. Confiamos no valor que entregamos."
                },
                {
                  question: "O que acontece se o agente errar?",
                  answer: "Monitoramos constantemente. Erros viram ajustes no treinamento. Além disso, você pode definir regras de quando escalar para humanos."
                },
                {
                  question: "Vocês fazem o treinamento da minha equipe?",
                  answer: "Sim. Incluímos treinamento básico no setup. Treinamentos avançados podem ser contratados à parte."
                },
                {
                  question: "É seguro? Meus dados ficam protegidos?",
                  answer: "Sim. Usamos criptografia de ponta a ponta. Seus dados nunca são compartilhados ou usados para treinar outros modelos."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section id="contato" className="py-section-lg bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h2 md:text-4xl font-bold mb-4">
              Pronto pra Automatizar?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Preencha o formulário e um especialista entrará em contato em até 24h úteis.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 text-left">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all"
                    placeholder="Nome da sua empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qual agente te interessa?
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="atendimento">Agente de Atendimento</option>
                    <option value="sdr">Agente SDR (Qualificação)</option>
                    <option value="cs">Agente CS (Retenção)</option>
                    <option value="pacote">Pacote Completo (3 Agentes)</option>
                    <option value="crm">CRM Kommo + Agente</option>
                    <option value="outro">Outro / Não sei ainda</option>
                  </select>
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-solveflow-green hover:bg-solveflow-green/90 text-lg py-6"
                >
                  Falar com Especialista
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <p className="text-blue-200 mb-4">— OU —</p>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Prefere falar direto? Manda mensagem
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Solveflow</h3>
              <p className="text-sm leading-relaxed">
                Agentes de IA para WhatsApp que transformam seu atendimento, vendas e retenção.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#produtos" className="hover:text-white transition-colors">Agente de Atendimento</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Agente SDR</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Agente CS (SolveCS™)</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Implantação Kommo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>contato@solveflow.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>São Paulo, SP</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Solveflow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
