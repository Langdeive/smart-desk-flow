import { useState } from "react";
import { MessageSquare, Target, Rocket, Check, ArrowRight, Phone, Mail, Building2, ChevronDown, Users, Zap, Brain, Link2, BarChart3, Settings, Clock, Shield, ShoppingBag, Briefcase, Laptop, Menu, X, CheckCircle, Calendar, Star, Clipboard, LifeBuoy, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import solveflowLogo from "@/assets/solveflow-logo.png";
import heroBackground from "@/assets/hero-background.png";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    interest: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('landing_leads')
        .insert({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          company: formData.company,
          interest: formData.interest
        });

      if (error) {
        console.error('Error saving lead:', error);
        alert('Ocorreu um erro. Por favor, tente novamente.');
        return;
      }

      setFormData({ name: "", email: "", whatsapp: "", company: "", interest: "" });
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappLink = "https://wa.me/5547999443087?text=Olá! Quero saber mais sobre os agentes de IA.";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center">
              <img src={solveflowLogo} alt="Solveflow" className="h-10" />
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#produtos" className="text-sm text-white/80 hover:text-solveflow-cyan transition-colors">Produtos</a>
              <a href="#metodologia" className="text-sm text-white/80 hover:text-solveflow-cyan transition-colors">Metodologia</a>
              <a href="#faq" className="text-sm text-white/80 hover:text-solveflow-cyan transition-colors">FAQ</a>
              <Button asChild className="bg-solveflow-purple hover:bg-solveflow-purple/90 text-white">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Falar Agora
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 animate-fade-in">
              <div className="flex flex-col gap-4">
                <a href="#produtos" className="text-sm text-white/80 hover:text-solveflow-cyan" onClick={() => setMobileMenuOpen(false)}>Produtos</a>
                <a href="#metodologia" className="text-sm text-white/80 hover:text-solveflow-cyan" onClick={() => setMobileMenuOpen(false)}>Metodologia</a>
                <a href="#faq" className="text-sm text-white/80 hover:text-solveflow-cyan" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <Button asChild className="bg-solveflow-purple hover:bg-solveflow-purple/90 text-white w-full">
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
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 text-white overflow-hidden relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-display font-extrabold leading-tight mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              Você Gasta Tempo em Operação.{" "}
              <span className="text-solveflow-cyan drop-shadow-[0_2px_8px_rgba(0,229,255,0.4)]">Deveria Estar Focando no Crescimento.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold mb-4">
              Nós Automatizamos Sua Operação com IA.
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Soluções Prontas. Consultoria Personalizada. Você Escolhe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-solveflow-cyan hover:bg-solveflow-cyan/90 text-solveflow-slate text-lg px-8 py-6 shadow-glow-cyan font-semibold" asChild>
                <a href="#contato">
                  Falar com Especialista
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Mandar Mensagem Agora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Hero Section */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-solveflow-slate/70 leading-relaxed mb-4">
              Solveflow é consultoria que trabalha com você para entender seus desafios operacionais e implementar IA que faz sentido.
            </p>
            <p className="text-lg text-solveflow-slate font-medium">
              Projetos prontos em 14 dias. Consultoria estratégica sob demanda.<br />
              <span className="text-solveflow-purple font-semibold">Sem complicação. Sem venda de ferramenta.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-section-lg bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
              Escale Seu Negócio Sem Contratar Mais Gente
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[{
              icon: "📉",
              title: "Sua Escalabilidade é Zero",
              description: "Você atende bem porque está ali. Mas aumentar volume? Só contratando. Só que contratar é lento, caro e traz dependência."
            }, {
              icon: "💸",
              title: "Leads Entram, Mas Não Saem com Venda",
              description: "Sem follow-up automatizado e qualificação inteligente, leads esquecem de você. Concorrência não dorme."
            }, {
              icon: "⏰",
              title: "Suporte Básico Rouba seu Tempo",
              description: "Respostas repetidas, dúvidas simples, troubleshooting… ocupam horas que poderiam estar em vendas ou relacionamento."
            }].map((problem, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-soft hover-lift border border-border">
                <span className="text-5xl mb-4 block">{problem.icon}</span>
                <h3 className="text-h4 font-semibold text-solveflow-slate mb-3">{problem.title}</h3>
                <p className="text-solveflow-slate/70 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          {/* Solution Sub-section */}
          <div className="bg-gradient-dark rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-wave-pattern opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Seus Agentes Não Tiram Férias. Não Pedem Aumento. Não Saem.
              </h3>
              <p className="text-lg text-white/70 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
                Eles trabalham 24/7, aprendem constantemente, melhoram com o tempo. Se integram ao seu CRM. Entendem seu negócio porque foram desenvolvidos especificamente para ele.
              </p>
              <p className="text-lg text-white/70 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
                Não é automação genérica. É <strong className="text-white">consultoria em IA transformada em agentes inteligentes</strong> que escalam sua operação.
              </p>
              <p className="text-xl font-semibold text-solveflow-cyan text-center">
                Resultado: você cresce sem o custo e a complexidade de contratar, treinar e gerenciar pessoas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-section-lg bg-solveflow-platinum">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
              Escolha o Agente Ideal para o Seu Negócio
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Agent 1 - Atendimento */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-solveflow-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="text-solveflow-purple" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-solveflow-slate mb-3">Agente de Atendimento</h3>
                <p className="text-solveflow-slate/70 mb-4">
                  Atendente IA disponível 24/7 que responde clientes em WhatsApp em 2-3 segundos. 
                  Conhece seus produtos, preços, horários e políticas. Encaminha casos complexos pro seu time. 
                  Registra tudo automaticamente.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> E-commerce, lojas físicas, consultórios, prestadores de serviço.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado esperado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ 70-85% das conversas resolvidas automaticamente</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Economia de 40h/mês (R$ 2.000/mês em tempo do seu time)</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-platinum/50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Investimento Único</p>
                  <p className="text-3xl font-bold text-solveflow-slate">R$ 3.500 <span className="text-sm font-normal text-solveflow-slate/70">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-purple">ZERO Mensalidade Obrigatória</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Atendimento 24/7 em WhatsApp</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Setup completo + Onboarding 30 dias</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Infraestrutura Própria (Você é o dono)</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Painel de atendimento incluso</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Consultoria de otimização</p>
                  </div>
                  <p className="text-xs text-solveflow-slate/60 mt-4 italic">
                    *Suporte mensal é 100% opcional. Você só contrata se quiser.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
                  <a href="#contato">Quero Automatizar Atendimento</a>
                </Button>
              </div>
            </div>

            {/* Agent 2 - SDR */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-solveflow-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-solveflow-purple" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-solveflow-slate mb-3">Agente SDR (Pré-Vendas)</h3>
                <p className="text-solveflow-slate/70 mb-4">
                  SDR Digital que qualifica leads 24/7 usando o método BANT (Orçamento, Autoridade, Necessidade e Tempo). Filtra curiosos, agenda reuniões e envia apenas os leads "quentes" para o seu time comercial fechar. Integramos com seu CRM.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> Consultorias, Clínicas, SaaS, Imobiliárias e B2B High Ticket.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado esperado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ 3x mais reuniões agendadas</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Seu time só fala com quem tem dinheiro e urgência para comprar</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-platinum/50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Investimento Único</p>
                  <p className="text-3xl font-bold text-solveflow-slate">R$ 6.000 <span className="text-sm font-normal text-solveflow-slate/70">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-purple">ZERO Mensalidade Obrigatória</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Qualificação BANT no WhatsApp</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Integração completa com CRM</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Notificação de Lead Quente pro Vendedor</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Infraestrutura Própria (Você é o dono)</p>
                  </div>
                  <p className="text-xs text-solveflow-slate/60 mt-4 italic">
                    *Precisa de CRM? Implantamos o Kommo por +R$ 2.000 (opcional).
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
                  <a href="#contato">Quero Qualificar Mais Leads</a>
                </Button>
              </div>
            </div>

            {/* Agent 3 - CS (Highlight) */}
            <div className="bg-white rounded-lg shadow-glow-cyan hover-lift border-2 border-solveflow-cyan overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 bg-solveflow-cyan text-solveflow-slate text-center py-2 text-sm font-semibold">
                🏆 EXCLUSIVO SOLVEFLOW
              </div>
              <div className="p-8 pt-14">
                <div className="w-16 h-16 bg-solveflow-cyan/10 rounded-lg flex items-center justify-center mb-6">
                  <Rocket className="text-solveflow-cyan" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-solveflow-slate mb-1">SolveCS™</h3>
                <p className="text-sm text-solveflow-cyan font-semibold mb-3">Um Único Objetivo: Reduzir Churn.</p>
                <p className="text-solveflow-slate/70 mb-4">
                  Não é apenas um agente. É uma plataforma completa de CS que automatiza Onboarding, 
                  Follow-up, Suporte N1 e NPS. Monitora a saúde do cliente e previne cancelamentos.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> SaaS, Assinaturas e Empresas com Churn Alto.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Redução de 25-35% no Churn (Cancelamento)</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-cyan/5 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Orçamento Sob Medida</p>
                  <p className="text-2xl font-bold text-solveflow-slate">Solução Enterprise</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> 4 Sistemas: Onboarding, Follow-up, Suporte, NPS</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Dashboard de Retenção Exclusivo</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Infraestrutura Gerenciada pela Solveflow</p>
                  </div>
                  <p className="text-xs text-solveflow-slate/60 mt-4 italic">
                    *Foco total em redução de Churn e aumento de LTV.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-cyan hover:bg-solveflow-cyan/90 text-solveflow-slate font-semibold" asChild>
                  <a href="#contato">Quero Reduzir meu Churn</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultoria Estratégica Section */}
      <section className="py-section-lg bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-wave-pattern"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold mb-4">
                Seu Desafio é Específico?{" "}
                <span className="text-solveflow-cyan">Nós Criamos a Estratégia Ideal.</span>
              </h2>
              <h3 className="text-xl md:text-2xl text-white/60 font-medium">
                Nem todo problema se resolve com uma solução padrão. Vamos entender o seu cenário.
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 mb-12 border border-white/10">
              <p className="text-lg text-white/70 leading-relaxed mb-4">
                Os Agentes Solveflow resolvem com rapidez as dores mais comuns do mercado (Atendimento, Vendas e Retenção). 
                Mas se a sua operação possui fluxos únicos ou gargalos que exigem um olhar clínico, o caminho é a <strong className="text-white">Consultoria</strong>.
              </p>
              <p className="text-lg text-solveflow-cyan font-medium">
                Nós não empurramos tecnologia. Nós analisamos sua empresa para encontrar as oportunidades ocultas de eficiência.
              </p>
            </div>

            <h4 className="text-xl font-semibold text-center mb-8 text-white/80">Como Funciona a Consultoria:</h4>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-purple/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🔍</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">Diagnóstico Operacional</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Primeiro, entendemos o seu negócio. Analisamos seus processos atuais para identificar onde estão os gargalos, 
                  o desperdício de tempo e o dinheiro deixado na mesa.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-purple/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🎯</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">A Regra 80/20 (Foco em Resultado)</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Não vamos automatizar tudo. Vamos identificar os 20% de mudanças que trarão 80% do resultado imediato. 
                  Definimos exatamente onde a IA deve atuar para gerar lucro ou economia real.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-cyan/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🚀</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">Projeto e Implementação</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Com a estratégia validada, desenhamos e implementamos a solução sob medida. Você recebe um sistema 
                  otimizado para a sua realidade, focado exclusivamente no que traz retorno.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-solveflow-cyan hover:bg-solveflow-cyan/90 text-solveflow-slate text-lg px-10 py-6 shadow-glow-cyan font-semibold" asChild>
                <a href="#contato">
                  Solicitar Diagnóstico Operacional
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </Button>
              <p className="text-white/50 text-sm mt-4">
                Vamos descobrir juntos onde sua empresa pode crescer.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CRM Kommo Section */}
      <section className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
                Não Tem CRM?{" "}
                <span className="text-gradient">Sem Problema.</span>
              </h2>
              <p className="text-lg text-solveflow-slate/70">
                Nós implementamos a estrutura completa para você profissionalizar sua operação comercial.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-solveflow-slate/70 mb-6 leading-relaxed">
                  Para ter agentes de IA eficientes, você precisa de dados organizados.
                </p>
                <p className="text-solveflow-slate/70 mb-6 leading-relaxed">
                  Somos parceiros oficiais do <strong className="text-solveflow-slate">Kommo CRM</strong> (antigo AmoCRM), a melhor ferramenta do mundo para vendas via WhatsApp. 
                  Nós entregamos o sistema configurado, personalizado para o seu funil de vendas e integrado aos nossos Agentes.
                </p>
                <h4 className="font-semibold text-solveflow-slate mb-4">O Que Sua Empresa Ganha:</h4>
                <ul className="space-y-3 mb-8">
                  {["Centralização do WhatsApp: Toda sua equipe atendendo em um único número, de forma organizada.", "Funil de Vendas Visual: Veja exatamente quantos leads estão em negociação e quanto dinheiro está na mesa.", "Histórico Completo: A IA registra cada conversa automaticamente. Nada se perde.", "Gestão à Vista: Relatórios de performance do time e das vendas em tempo real."].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="text-solveflow-cyan flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-solveflow-slate/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-solveflow-platinum rounded-lg p-8 border border-border">
                <h4 className="text-xl font-bold text-solveflow-slate mb-4 text-center">Setup de CRM Consultivo</h4>
                <p className="text-solveflow-slate/70 text-center mb-6 leading-relaxed">
                  Não vendemos apenas a licença. Entregamos a <strong className="text-solveflow-slate">Inteligência Comercial</strong>: 
                  desenhamos as etapas do seu funil, configuramos automações e treinamos seu time para usar a ferramenta.
                </p>
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" size="lg" asChild>
                  <a href="#contato">Quero incluir CRM no meu projeto</a>
                </Button>
                <p className="text-xs text-center text-solveflow-slate/60 mt-4">
                  Já usa outro CRM? Também integramos com Pipedrive, HubSpot e outros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodologia" className="py-section-lg bg-solveflow-platinum">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
              Metodologia de Implementação Consultiva
            </h2>
            <p className="text-lg text-solveflow-slate/70">
              Do contrato ao Go-Live em até 14 dias. Processo estruturado para você não perder tempo.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[{
                step: "1",
                title: "Discovery & Estratégia",
                time: "45 min (Reunião)",
                description: "Reunião de alinhamento onde entendemos seu negócio, mapeamos suas regras de atendimento e definimos o tom de voz da IA. Você nos fornece os materiais, nós desenhamos a estratégia."
              }, {
                step: "2",
                title: "Setup Técnico (Hands-off)",
                time: "5 a 10 Dias",
                description: "Nós trabalhamos, você aguarda. Configuramos a infraestrutura (VPS), conectamos seu WhatsApp, integramos o CRM e treinamos a inteligência artificial com seus dados."
              }, {
                step: "3",
                title: "Homologação e Testes",
                time: "2 a 3 Dias",
                description: "Liberamos o acesso para você testar. Simulamos conversas reais e realizamos ajustes ilimitados nas respostas até que o comportamento da IA esteja perfeito."
              }, {
                step: "4",
                title: "Go-Live e Onboarding",
                time: "1 Dia (Imediato)",
                description: "Ativamos a operação real. A partir daqui, iniciamos o acompanhamento de 30 dias, monitorando as conversas diariamente para garantir o resultado prometido."
              }].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-solveflow-purple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow-purple">
                    {item.step}
                  </div>
                  <h3 className="text-h4 font-semibold text-solveflow-slate mb-1">{item.title}</h3>
                  <p className="text-sm text-solveflow-purple font-medium mb-3">⏱️ {item.time}</p>
                  <p className="text-sm text-solveflow-slate/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
              <a href="#contato">
                Começar Agora
                <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-section-lg bg-solveflow-platinum">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
                Perguntas Frequentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {/* Sobre o Funcionamento */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-solveflow-slate/60 uppercase tracking-wide mb-4">Sobre o Funcionamento</p>
              </div>
              
              {[{
                question: "O cliente vai perceber que está falando com um robô?",
                answer: 'Nossos agentes usam Inteligência Artificial Generativa. Eles entendem gírias, erros de português e áudios, respondendo de forma natural e empática. Porém, somos transparentes: se o cliente perguntar "você é um robô?", ele responderá que sim e oferecerá falar com um humano imediatamente.'
              }, {
                question: "E se a IA responder algo errado?",
                answer: 'No período de Setup e Testes, nós simulamos centenas de cenários para garantir que isso não aconteça. Além disso, a IA é programada com uma "trava de segurança": se ela não tiver 100% de certeza da resposta, ela não inventa — ela transfere a conversa para o seu time humano.'
              }, {
                question: "O que acontece se o cliente quiser falar com uma pessoa?",
                answer: 'O sistema detecta a intenção (ex: "quero falar com atendente" ou sinais de irritação) e transfere o chat para o seu time na hora. Você recebe a notificação no celular/computador e assume a conversa exatamente de onde a IA parou, com todo o histórico visível.'
              }].map((faq, index) => (
                <AccordionItem key={`func-${index}`} value={`func-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Sobre Custos e Mensalidade */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-solveflow-slate/60 uppercase tracking-wide mb-4">Sobre Custos e Mensalidade</p>
              </div>
              
              {[{
                question: 'O que significa "Zero Mensalidade Obrigatória"?',
                answer: "Para os Agentes de Atendimento e SDR, nós não cobramos \"aluguel\" do software. Você paga pelo desenvolvimento (Setup) e a estrutura é sua. Você terá apenas os custos de infraestrutura direto com os fornecedores (Servidor + Consumo de IA), que giram em torno de R$ 150 a R$ 300 mensais dependendo do volume. Nós configuramos tudo isso para você ficar no seu nome."
              }, {
                question: "Vocês oferecem suporte depois da entrega?",
                answer: "Sim. Todos os projetos incluem 30 dias de acompanhamento intensivo. Após esse período, se você quiser que nossa equipe continue monitorando, otimizando as respostas e atualizando o sistema, oferecemos planos de suporte opcional (a partir de R$ 297/mês). Se não quiser contratar, o sistema continua funcionando e é todo seu."
              }, {
                question: "Por que o Agente SolveCS tem mensalidade e os outros não?",
                answer: "O SolveCS é uma plataforma complexa de retenção que envolve 4 sistemas simultâneos (Onboarding, Follow-up, Suporte e NPS) e um Dashboard exclusivo hospedado em nossa infraestrutura de alta performance. Por isso, ele funciona no modelo de assinatura (SaaS) para garantir a estabilidade e evolução contínua das ferramentas."
              }].map((faq, index) => (
                <AccordionItem key={`custo-${index}`} value={`custo-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Técnico e Implementação */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-solveflow-slate/60 uppercase tracking-wide mb-4">Técnico e Implementação</p>
              </div>
              
              {[{
                question: "Preciso ter um número novo de WhatsApp?",
                answer: "Não necessariamente. Podemos migrar seu número atual para o sistema. Porém, durante a Discovery Call, analisamos seu caso: para operações maiores, frequentemente recomendamos ter um número oficial para a IA e manter os vendedores com seus números, tudo centralizado no CRM."
              }, {
                question: "Não tenho CRM, o agente funciona mesmo assim?",
                answer: "Funciona, mas você perde inteligência. Por isso, para clientes sem CRM, nós incluímos a implantação do Kommo CRM no projeto (consulte condições). Assim, você não ganha apenas um atendente de IA, mas organiza todo o seu processo comercial."
              }, {
                question: "E se eu mudar meus preços ou horários depois?",
                answer: "É simples. Se você tiver nosso suporte mensal, basta nos avisar no WhatsApp e atualizamos na hora. Se não tiver, nós deixamos um painel administrativo fácil onde você mesmo pode alterar textos e informações da base de conhecimento sem precisar de programação."
              }, {
                question: "Tem fidelidade ou multa de cancelamento?",
                answer: "Para os Agentes de Atendimento e SDR (Investimento Único), não existe cancelamento pois o produto é seu. Para o SolveCS e planos de Suporte, o contrato é mensal. Você pode cancelar a qualquer momento com aviso prévio de 30 dias, sem multas abusivas."
              }].map((faq, index) => (
                <AccordionItem key={`tec-${index}`} value={`tec-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section id="contato" className="py-section-lg bg-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-wave-pattern"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-h2 md:text-4xl font-bold mb-4">
              Pronto pra Automatizar?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Preencha o formulário e um especialista entrará em contato em até 24h úteis.
            </p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 text-left shadow-glow-mixed">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    Seu nome
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" 
                    placeholder="Seu nome" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    E-mail
                  </label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" 
                    placeholder="seu@email.com" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" 
                    placeholder="(47) 99999-9999" 
                    value={formData.whatsapp} 
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    Empresa
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" 
                    placeholder="Nome da sua empresa" 
                    value={formData.company} 
                    onChange={e => setFormData({ ...formData, company: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    Qual agente te interessa?
                  </label>
                  <select 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" 
                    value={formData.interest} 
                    onChange={e => setFormData({ ...formData, interest: e.target.value })}
                  >
                    <option value="" className="text-solveflow-slate/50">Selecione uma opção</option>
                    <option value="atendimento" className="text-solveflow-slate">Agente de Atendimento</option>
                    <option value="sdr" className="text-solveflow-slate">Agente SDR (Qualificação)</option>
                    <option value="cs" className="text-solveflow-slate">SolveCS (Retenção)</option>
                    <option value="crm" className="text-solveflow-slate">CRM Kommo + Agente</option>
                    <option value="consultoria" className="text-solveflow-slate">Consultoria Estratégica</option>
                    <option value="outro" className="text-solveflow-slate">Outro / Não sei ainda</option>
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white text-lg py-6" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Falar com Especialista"}
                  {!isSubmitting && <ArrowRight className="ml-2" size={20} />}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <p className="text-white/50 mb-4">— OU —</p>
              <Button variant="outline" size="lg" className="border-white/30 bg-white/5 text-white hover:bg-white/10" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Prefere falar direto? Manda mensagem
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-solveflow-slate text-white/60 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src={solveflowLogo} alt="Solveflow" className="h-10 mb-4 brightness-0 invert" />
              <p className="text-sm leading-relaxed">
                Consultoria de IA que automatiza sua operação com agentes inteligentes para WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#produtos" className="hover:text-solveflow-cyan transition-colors">Agente de Atendimento</a></li>
                <li><a href="#produtos" className="hover:text-solveflow-cyan transition-colors">Agente SDR</a></li>
                <li><a href="#produtos" className="hover:text-solveflow-cyan transition-colors">SolveCS™</a></li>
                <li><a href="#produtos" className="hover:text-solveflow-cyan transition-colors">Implantação Kommo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#metodologia" className="hover:text-solveflow-cyan transition-colors">Metodologia</a></li>
                <li><a href="#faq" className="hover:text-solveflow-cyan transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-solveflow-cyan transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-solveflow-cyan transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-solveflow-cyan" />
                  <span>(47) 99944-3087</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-solveflow-cyan" />
                  <span>contato@solveflow.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 size={16} className="text-solveflow-cyan" />
                  <span>Jaraguá do Sul, SC</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Solveflow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-solveflow-cyan/10">
              <CheckCircle className="h-10 w-10 text-solveflow-cyan" />
            </div>
            <DialogTitle className="text-center text-xl text-solveflow-slate">Mensagem Enviada!</DialogTitle>
            <DialogDescription className="text-center text-base text-solveflow-slate/70">
              Obrigado pelo seu interesse! Um de nossos especialistas entrará em contato em até 24 horas úteis.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-solveflow-purple hover:bg-solveflow-purple/90 text-white">
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
