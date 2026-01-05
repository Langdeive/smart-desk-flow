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
      const {
        error
      } = await supabase.from('landing_leads').insert({
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
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        company: "",
        interest: ""
      });
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error:', err);
      alert('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const whatsappLink = "https://wa.me/5547999443087?text=Olá! Quero saber mais sobre os agentes de IA.";
  return <div className="min-h-screen bg-background">
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
          {mobileMenuOpen && <div className="md:hidden pt-4 pb-2 animate-fade-in">
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
            </div>}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 text-white overflow-hidden relative">
        {/* Background Image with lazy loading */}
        <img src={heroBackground} alt="" loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-display font-extrabold leading-tight mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              Escale o seu faturamento em 10x{" "}
              <span className="text-solveflow-cyan drop-shadow-[0_2px_8px_rgba(0,229,255,0.4)]">sem aumentar sua operação, utilizando IA</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              O seu teto de crescimento hoje é a sua capacidade manual. Cresça a sua margem, sem explodir os custos fixos.
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-solveflow-slate mb-6">
              A Solveflow é a camada de inteligência que faltava na sua operação.
            </h2>
            <p className="text-lg md:text-xl text-solveflow-slate/70 leading-relaxed mb-6">
              Trabalhamos lado a lado com você para entender seus desafios reais. Não automatizamos processos por beleza; automatizamos para aumentar a margem de lucro e liberar seu tempo para o que importa: crescer.
            </p>
            <p className="text-lg text-solveflow-purple font-semibold">
              A Regra do 80/20: Focamos nas mudanças que trazem o maior retorno financeiro no menor tempo possível.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-section-lg bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
              Onde a sua empresa está deixando dinheiro na mesa?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[{
            icon: "🔗",
            title: "Dependência de Presença Humana",
            description: "Se você não está lá, as coisas param. Sua escalabilidade é zero porque o atendimento de qualidade é refém do esforço manual. É impossível fazer 10x mais vendas com a estrutura que você tem hoje."
          }, {
            icon: "🔥",
            title: "O Custo da Demora (Lead Burn)",
            description: "O lead moderno tem a paciência de segundos. Se você não qualifica e atende no auge do interesse, você perde a venda. Nossa infraestrutura garante que 100% dos leads recebam atenção imediata."
          }, {
            icon: "⏰",
            title: "Ineficiência de Processos N1",
            description: "Suporte básico e agendamentos roubam a energia do seu time. Automatizar a camada de atendimento é a única forma de liberar seu time comercial para o que realmente traz ROI: o relacionamento."
          }].map((problem, index) => <div key={index} className="bg-white rounded-lg p-8 shadow-soft hover-lift border border-border">
                <span className="text-5xl mb-4 block">{problem.icon}</span>
                <h3 className="text-h4 font-semibold text-solveflow-slate mb-3">{problem.title}</h3>
                <p className="text-solveflow-slate/70 leading-relaxed">{problem.description}</p>
              </div>)}
          </div>

          {/* Solution Sub-section */}
          <div className="bg-gradient-dark rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-wave-pattern opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Sistemas Autônomos que Não Param. Sua Operação Também Não.
              </h3>
              <p className="text-lg text-white/70 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
                Diferente de uma equipe humana, sua Infraestrutura de IA opera com 100% de consistência 24 horas por dia, 7 dias por semana. Ela aprende com cada interação, integra-se perfeitamente ao seu CRM e executa processos complexos sem nunca perder o tom de voz da sua marca.
              </p>
              <p className="text-lg text-white/70 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
                Não entregamos uma automação genérica. Entregamos uma <strong className="text-white">Engenharia de Processos transformada em sistemas inteligentes</strong> que sustentam o seu crescimento.
              </p>
              <p className="text-xl font-semibold text-solveflow-cyan text-center">
                Resultado: Você escala o faturamento eliminando o custo, o tempo de treinamento e a complexidade de gerenciar grandes equipes.
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
              Inicie com Infraestruturas Modulares e Validadas
            </h2>
            <p className="text-lg text-solveflow-slate/70">
              Projetos com 80% da estrutura já modelada para acelerar seu resultado. Escolha o pilar que sua operação precisa destravar agora.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Agent 1 - Atendimento */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-solveflow-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="text-solveflow-purple" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-solveflow-slate mb-3">Central de Atendimento Autônoma 24/7</h3>
                <p className="text-solveflow-slate/70 mb-4">
                  Escalabilidade infinita: atenda 10 ou 10.000 clientes com o mesmo custo operacional. Uma infraestrutura que conhece cada detalhe do seu negócio e responde com precisão cirúrgica, sem nunca precisar de treinamento ou férias.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> E-commerce, Clínicas, Academias, Prestadores de Serviço e Empresas com alto volume de suporte.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado esperado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Até 85% das conversas resolvidas de forma totalmente autônoma.</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Economia direta de +40h/mês da sua equipe operacional.</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-platinum/50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Modelo de Investimento:</p>
                  <p className="text-lg font-semibold text-solveflow-slate">Setup de Implementação + Manutenção de Inteligência</p>
                  <p className="text-sm text-solveflow-slate/60 italic mb-4">(Valor sob diagnóstico consultivo)</p>
                  <p className="text-sm text-solveflow-slate font-medium mb-2">Checklist de Entrega:</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" />Atendimento 24/7 em WhatsApp</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Setup completo com base de dados própria.</p>
                    
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Painel de gestão de atendimento incluso.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Otimização contínua da inteligência.</p>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
                  <a href="#contato">Implementar Atendimento Autônomo</a>
                </Button>
              </div>
            </div>

            {/* Agent 2 - SDR */}
            <div className="bg-white rounded-lg shadow-soft hover-lift border border-border overflow-hidden">
              <div className="p-8">
                <div className="w-16 h-16 bg-solveflow-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="text-solveflow-purple" size={32} />
                </div>
                <h3 className="text-h3 font-bold text-solveflow-slate mb-3">Infraestrutura de Aceleração Comercial (SDR)</h3>
                <p className="text-solveflow-slate/70 mb-4">
                  Pare de queimar seu orçamento de marketing com leads que esfriam no WhatsApp. Implementamos o filtro BANT automático que qualifica o poder de compra e agenda reuniões, garantindo que seu vendedor só fale com quem tem dinheiro e urgência.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> Consultorias, Imobiliárias, SaaS, Clínicas e Vendas de Alto Ticket.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado esperado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Aumento de até 3x no volume de reuniões qualificadas agendadas.</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Seu time comercial fala apenas com quem tem dinheiro e urgência.</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-platinum/50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Modelo de Investimento:</p>
                  <p className="text-lg font-semibold text-solveflow-slate">Setup de Implementação + Manutenção de Inteligência</p>
                  <p className="text-sm text-solveflow-slate/60 italic mb-4">(Valor sob diagnóstico consultivo)</p>
                  <p className="text-sm text-solveflow-slate font-medium mb-2">Checklist de Entrega:</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Qualificação BANT automatizada no WhatsApp.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Integração completa e nativa com seu CRM.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Notificação imediata de "Lead Quente" para o vendedor.</p>
                    
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Refinamento constante de scripts de conversão.</p>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
                  <a href="#contato">Escalar Minhas Vendas</a>
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
                <h3 className="text-h3 font-bold text-solveflow-slate mb-1">SolveCS™ – Ecossistema de Sucesso do Cliente</h3>
                <p className="text-solveflow-slate/70 mb-4">
                  Maximize o valor de cada cliente que entra. Nossa infraestrutura gerencia o onboarding e o sucesso do cliente, garantindo que ele permaneça pagando por muito mais tempo e elevando a lucratividade vitalícia do seu negócio.
                </p>
                <p className="text-sm text-solveflow-slate/70 mb-4">
                  <strong className="text-solveflow-slate">Ideal para:</strong> SaaS, Clubes de Assinatura, Academias e Empresas com receita recorrente.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-solveflow-slate font-medium">Resultado esperado:</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Redução média de 25-35% na taxa de Churn (Cancelamento).</p>
                  <p className="text-sm text-solveflow-slate/70">✓ Aumento da lucratividade vitalícia por cada cliente conquistado.</p>
                </div>
                <div className="border-t border-border pt-6 bg-solveflow-cyan/5 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-solveflow-slate/70 mb-1">Modelo de Investimento:</p>
                  <p className="text-lg font-semibold text-solveflow-slate">Solução Enterprise / Orçamento Sob Medida</p>
                  <p className="text-sm text-solveflow-slate/60 italic mb-4">Foco total em redução de Churn e aumento de LTV.</p>
                  <p className="text-sm text-solveflow-slate font-medium mb-2">Checklist de Entrega:</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> 4 Sistemas: Onboarding, Follow-up, Suporte N1 e NPS.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Dashboard exclusivo de indicadores de Retenção.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Alerta de risco de cancelamento em tempo real.</p>
                    <p className="flex items-center gap-2 text-solveflow-slate/80"><Check size={16} className="text-solveflow-cyan" /> Infraestrutura 100% gerenciada pela Solveflow.</p>
                    
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-cyan hover:bg-solveflow-cyan/90 text-solveflow-slate font-semibold" asChild>
                  <a href="#contato">Blindar Minha Receita</a>
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
                Sua Operação Exige Exclusividade?{" "}
                <span className="text-solveflow-cyan">Desenvolvemos sua Infraestrutura sob Medida.</span>
              </h2>
              <h3 className="text-xl md:text-2xl text-white/60 font-medium">
                Nem todo gargalo operacional se resolve com padrões. Para empresas com fluxos complexos e regras de negócio únicas, criamos o seu Ecossistema de IA Personalizado.
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 mb-12 border border-white/10">
              <p className="text-lg text-white/70 leading-relaxed mb-4">
                As soluções modulares da Solveflow resolvem com rapidez as dores de atendimento e vendas. No entanto, se a sua empresa possui integrações profundas com ERPs, processos logísticos complexos ou fluxos de dados sensíveis, o caminho é a <strong className="text-white">Engenharia Consultiva</strong>.
              </p>
              <p className="text-lg text-solveflow-cyan font-medium">
                Nós não apenas instalamos tecnologia. Nós realizamos uma imersão na sua operação para projetar a infraestrutura proprietária que transformará ineficiência em lucro líquido.
              </p>
            </div>

            <h4 className="text-xl font-semibold text-center mb-8 text-white/80">Os Três Pilares da Consultoria:</h4>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-purple/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🔍</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">Diagnóstico de Engenharia Operacional</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Mapeamos cada etapa da sua jornada atual para identificar os pontos cegos onde o seu lucro está sendo drenado. Analisamos seus processos para definir exatamente onde a inteligência deve ser injetada para gerar o maior impacto financeiro.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-purple/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🎯</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">Estratégia 80/20 focada em EBITDA</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">
                  Não automatizamos por beleza, mas por resultado. Identificamos os 20% de automações críticas que trarão 80% de retorno imediato sobre o seu investimento, otimizando sua margem sem aumentar seus custos fixos.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:border-solveflow-cyan/50">
                <div className="w-16 h-16 bg-solveflow-cyan/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl">🚀</span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-3 text-center">Implementação de Ecossistema Integrado</h5>
                <p className="text-white/60 text-sm leading-relaxed text-center">Com a estratégia validada, desenhamos e implementamos sua infraestrutura exclusiva. Entregamos um sistema proprietário totalmente integrado ao seu CRM, focado exclusivamente no que traz retorno real ao seu negócio.</p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-solveflow-cyan hover:bg-solveflow-cyan/90 text-solveflow-slate text-lg px-10 py-6 shadow-glow-cyan font-semibold" asChild>
                <a href="#contato">
                  Solicitar Diagnóstico Estratégico
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </Button>
              <p className="text-white/50 text-sm mt-4">
                Vamos descobrir juntos onde sua empresa pode crescer com eficiência.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Methodology Section */}
      <section id="metodologia" className="py-section-lg bg-solveflow-platinum">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-solveflow-slate mb-4">
              Metodologia de Implementação Ágil
            </h2>
            <p className="text-lg text-solveflow-slate/70">
              Do diagnóstico ao Go-Live em até 14 dias para soluções modulares. Processo de engenharia estruturado para você não perder tempo.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[{
              step: "1",
              title: "Mapeamento & Estratégia",
              time: "45 min (Reunião Técnica)",
              description: "Reunião de alinhamento para entender os gargalos da sua operação, mapear regras de negócio e definir o tom de voz da inteligência. Identificamos os pontos de maior impacto para o seu ROI."
            }, {
              step: "2",
              title: "Arquitetura & Setup (Hands-off)",
              time: "5 a 10 Dias (Soluções Modulares)",
              description: "Nossa equipe assume a execução. Configuramos sua infraestrutura (VPS), conectamos o WhatsApp, integramos seu CRM e treinamos a inteligência com seus dados proprietários.",
              note: "Nota: Projetos de ecossistemas personalizados possuem cronograma de engenharia sob medida."
            }, {
              step: "3",
              title: "Homologação & Estresse de Dados",
              time: "2 a 3 Dias",
              description: "Liberamos o acesso para testes reais. Simulamos interações complexas e realizamos ajustes ilimitados nos prompts até que o comportamento da infraestrutura esteja impecável e seguro."
            }, {
              step: "4",
              title: "Ativação & Evolução (Go-Live)",
              time: "Ativação Imediata",
              description: "Ativamos a operação real. Iniciamos o acompanhamento de 7 dias com monitoramento diário de logs para garantir o desempenho prometido e o refinamento contínuo da inteligência."
            }].map((item, index) => <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-solveflow-purple text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-glow-purple">
                    {item.step}
                  </div>
                  <h3 className="text-h4 font-semibold text-solveflow-slate mb-1">{item.title}</h3>
                  <p className="text-sm text-solveflow-purple font-medium mb-3">⏱️ {item.time}</p>
                  <p className="text-sm text-solveflow-slate/70">{item.description}</p>
                  {item.note && <p className="text-xs text-solveflow-slate/50 mt-2 italic">{item.note}</p>}
                </div>)}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-solveflow-purple hover:bg-solveflow-purple/90 text-white" asChild>
              <a href="#contato">
                Iniciar Minha Implementação
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
              question: "O cliente vai perceber que está falando com uma Inteligência Artificial?",
              answer: "Nossa infraestrutura utiliza Processamento de Linguagem Natural avançado e é treinada especificamente com os dados e a cultura da sua empresa. A comunicação é fluida, humana e respeita rigorosamente o tom de voz da sua marca. O objetivo é que o cliente sinta que está sendo atendido por um especialista ultra-eficiente que responde em 2 segundos."
            }, {
              question: "E se a IA responder algo errado?",
              answer: 'No período de Setup e Homologação, simulamos centenas de cenários reais para blindar a operação. Além disso, a infraestrutura possui uma "trava de segurança": se ela não identificar 100% de certeza nos dados fornecidos, ela não inventa informações — ela realiza o transbordo inteligente para o seu time humano imediatamente.'
            }, {
              question: "O que acontece se o cliente quiser falar com uma pessoa?",
              answer: "A transição é imediata e transparente. A IA identifica a intenção de falar com um consultor, registra todo o contexto da conversa no seu CRM e notifica seu time em tempo real para que eles assumam apenas a parte estratégica do fechamento."
            }].map((faq, index) => <AccordionItem key={`func-${index}`} value={`func-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}

              {/* Sobre Investimento e Gestão */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-solveflow-slate/60 uppercase tracking-wide mb-4">Sobre Investimento e Gestão</p>
              </div>
              
              {[{
              question: "Preciso me preocupar com a gestão técnica da infraestrutura?",
              answer: "Não. A Solveflow entrega uma Solução Gerenciada de Ponta a Ponta. Nós somos os responsáveis por hospedar, monitorar e manter toda a inteligência rodando em nossos servidores seguros. Isso garante que você tenha o resultado (lucro e eficiência) sem precisar de uma equipe de TI interna para gerenciar a tecnologia."
            }, {
              question: "Existe fidelidade ou multa de cancelamento?",
              answer: "Trabalhamos com o modelo de recorrência mensal sem multas abusivas. No entanto, como a infraestrutura de inteligência é gerenciada e evoluída pela Solveflow, o cancelamento da mensalidade implica na interrupção do sistema de IA, uma vez que a camada de processamento e segurança é provida por nós."
            }].map((faq, index) => <AccordionItem key={`invest-${index}`} value={`invest-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}

              {/* Técnico e Implementação */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-solveflow-slate/60 uppercase tracking-wide mb-4">Técnico e Implementação</p>
              </div>
              
              {[{
              question: "Preciso ter um número novo de WhatsApp?",
              answer: "Não é necessário. Podemos implementar a infraestrutura no seu número atual ou configurar um novo canal exclusivo para a IA, dependendo da sua estratégia de separação entre atendimento e vendas."
            }, {
              question: "Não tenho CRM, o sistema funciona mesmo assim?",
              answer: 'Para que a IA tenha "memória" e gere inteligência de dados para o seu negócio, o CRM é fundamental. Caso você não possua um, nós implementamos e configuramos toda a estrutura de CRM como parte da nossa consultoria, garantindo que sua operação seja profissional e escalável.'
            }, {
              question: "E se eu mudar meus preços, produtos ou horários depois?",
              answer: "A infraestrutura é modular. Através da nossa gestão mensal, realizamos todas as atualizações na base de conhecimento da IA sempre que o seu negócio mudar, garantindo que ela nunca entregue informações desatualizadas aos seus clientes."
            }, {
              question: "Qual é o prazo real de entrega?",
              answer: "Para nossas soluções modulares e validadas (80/20), o Go-Live acontece em até 14 dias. Projetos de ecossistemas 100% personalizados exigem um cronograma de engenharia específico, definido logo após o diagnóstico operacional inicial."
            }].map((faq, index) => <AccordionItem key={`tec-${index}`} value={`tec-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-solveflow-slate">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-solveflow-slate/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
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
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    E-mail
                  </label>
                  <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    WhatsApp
                  </label>
                  <input type="tel" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" placeholder="(47) 99999-9999" value={formData.whatsapp} onChange={e => setFormData({
                  ...formData,
                  whatsapp: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    Empresa
                  </label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" placeholder="Nome da sua empresa" value={formData.company} onChange={e => setFormData({
                  ...formData,
                  company: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-solveflow-slate mb-2">
                    Qual agente te interessa?
                  </label>
                  <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-purple focus:border-transparent transition-all text-solveflow-slate bg-white" value={formData.interest} onChange={e => setFormData({
                  ...formData,
                  interest: e.target.value
                })}>
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
                Consultoria de IA que automatiza sua operação com agentes inteligentes.
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
    </div>;
};
export default Index;