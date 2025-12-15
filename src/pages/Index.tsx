import { useState } from "react";
import { MessageSquare, Target, Rocket, Check, ArrowRight, Phone, Mail, Building2, ChevronDown, Users, Zap, Brain, Link2, BarChart3, Settings, Clock, Shield, ShoppingBag, Briefcase, Laptop, Menu, X, CheckCircle, Calendar, Star, Clipboard, LifeBuoy, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
  const whatsappLink = "https://wa.me/5547999443087?text=Olá! Quero saber mais sobre os agentes de IA.";
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold text-gradient">Solveflow</a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Produtos</a>
              <a href="#metodologia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Metodologia</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <Button asChild className="bg-solveflow-green hover:bg-solveflow-green/90">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  💬 Falar Agora
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && <div className="md:hidden pt-4 pb-2 animate-fade-in">
              <div className="flex flex-col gap-4">
                <a href="#produtos" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Produtos</a>
                <a href="#metodologia" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Metodologia</a>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <Button asChild className="bg-solveflow-green hover:bg-solveflow-green/90 w-full">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    💬 Falar Agora
                  </a>
                </Button>
              </div>
            </div>}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-display font-extrabold leading-tight mb-6">
                Você Gasta Tempo em Operação.{" "}
                <span className="text-solveflow-green">Deveria Estar Focando no Crescimento.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white font-semibold mb-4">
                Nós Automatizamos Sua Operação com IA.
              </p>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Soluções Prontas. Consultoria Personalizada. Você Escolhe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button size="lg" className="bg-solveflow-green hover:bg-solveflow-green/90 text-white text-lg px-8 py-6 shadow-glow-green" asChild>
                  <a href="#contato">
                    Falar com Especialista
                    <ArrowRight className="ml-2" size={20} />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    💬 Mandar Mensagem Agora
                  </a>
                </Button>
              </div>
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

      {/* Sub-Hero Section */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Solveflow é consultoria que trabalha com você para entender seus desafios operacionais e implementar IA que faz sentido.
            </p>
            <p className="text-lg text-foreground font-medium">
              Projetos prontos em 14 dias. Consultoria estratégica sob demanda.<br />
              <span className="text-solveflow-green">Sem complicação. Sem venda de ferramenta.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-section-lg bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
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
          }].map((problem, index) => <div key={index} className="bg-white rounded-lg p-8 shadow-soft hover-lift border border-border">
                <span className="text-5xl mb-4 block">{problem.icon}</span>
                <h3 className="text-h4 font-semibold text-foreground mb-3">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>)}
          </div>

          {/* Solution Sub-section */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Seus Agentes Não Tiram Férias. Não Pedem Aumento. Não Saem.
            </h3>
            <p className="text-lg text-blue-100 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
              Eles trabalham 24/7, aprendem constantemente, melhoram com o tempo. Se integram ao seu CRM. Entendem seu negócio porque foram desenvolvidos especificamente para ele.
            </p>
            <p className="text-lg text-blue-100 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
              Não é automação genérica. É <strong>consultoria em IA transformada em agentes inteligentes</strong> que escalam sua operação.
            </p>
            <p className="text-xl font-semibold text-solveflow-green text-center">
              Resultado: você cresce sem o custo e a complexidade de contratar, treinar e gerenciar pessoas.
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
                  Atendente IA disponível 24/7 que responde clientes em WhatsApp em 2-3 segundos. 
                  Conhece seus produtos, preços, horários e políticas. Encaminha casos complexos pro seu time. 
                  Registra tudo automaticamente.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> E-commerce, lojas físicas, consultórios, prestadores de serviço.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-foreground font-medium">Resultado esperado:</p>
                  <p className="text-sm text-muted-foreground">✓ 70-85% das conversas resolvidas automaticamente</p>
                  <p className="text-sm text-muted-foreground">✓ Economia de 40h/mês (R$ 2.000/mês em tempo do seu time)</p>
                </div>
                <div className="border-t border-border pt-6 bg-gray-50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-muted-foreground mb-1">Investimento Único</p>
                  <p className="text-3xl font-bold text-foreground">R$ 3.500 <span className="text-sm font-normal text-muted-foreground">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-green">ZERO Mensalidade Obrigatória</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Atendimento 24/7 em WhatsApp</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Setup completo + Onboarding 30 dias</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Infraestrutura Própria (Você é o dono)</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Painel de atendimento incluso</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Consultoria de otimização</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    *Suporte mensal é 100% opcional. Você só contrata se quiser.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
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
                <h3 className="text-h3 font-bold text-foreground mb-3">Agente SDR (Pré-Vendas)</h3>
                <p className="text-muted-foreground mb-4">
                  SDR Digital que qualifica leads 24/7 usando o método BANT (Orçamento, Autoridade, Necessidade e Tempo). Filtra curiosos, agenda reuniões e envia apenas os leads "quentes" para o seu time comercial fechar. Integramos com seu CRM.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> Consultorias, Clínicas, SaaS, Imobiliárias e B2B High Ticket.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-foreground font-medium">Resultado esperado:</p>
                  <p className="text-sm text-muted-foreground">✓ 3x mais reuniões agendadas</p>
                  <p className="text-sm text-muted-foreground">✓ Seu time só fala com quem tem dinheiro e urgência para comprar</p>
                </div>
                <div className="border-t border-border pt-6 bg-gray-50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-muted-foreground mb-1">Investimento Único</p>
                  <p className="text-3xl font-bold text-foreground">R$ 6.000 <span className="text-sm font-normal text-muted-foreground">(setup)</span></p>
                  <p className="text-lg font-semibold text-solveflow-green">ZERO Mensalidade Obrigatória</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Qualificação BANT no WhatsApp</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Integração completa com CRM</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Notificação de Lead Quente pro Vendedor</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Infraestrutura Própria (Você é o dono)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    *Precisa de CRM? Implantamos o Kommo por +R$ 2.000 (opcional).
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-purple hover:bg-solveflow-purple/90" asChild>
                  <a href="#contato">Quero Qualificar Mais Leads</a>
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
                <h3 className="text-h3 font-bold text-foreground mb-1">SolveCS™</h3>
                <p className="text-sm text-solveflow-green font-semibold mb-3">Um Único Objetivo: Reduzir Churn.</p>
                <p className="text-muted-foreground mb-4">
                  Não é apenas um agente. É uma plataforma completa de CS que automatiza Onboarding, 
                  Follow-up, Suporte N1 e NPS. Monitora a saúde do cliente e previne cancelamentos.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Ideal para:</strong> SaaS, Assinaturas e Empresas com Churn Alto.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-foreground font-medium">Resultado:</p>
                  <p className="text-sm text-muted-foreground">✓ Redução de 25-35% no Churn (Cancelamento)</p>
                </div>
                <div className="border-t border-border pt-6 bg-green-50 -mx-8 px-8 pb-6 -mb-8">
                  <p className="text-sm text-muted-foreground mb-1">Orçamento Sob Medida</p>
                  <p className="text-2xl font-bold text-foreground">Solução Enterprise</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> 4 Sistemas: Onboarding, Follow-up, Suporte, NPS</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Dashboard de Retenção Exclusivo</p>
                    <p className="flex items-center gap-2"><Check size={16} className="text-solveflow-green" /> Infraestrutura Gerenciada pela Solveflow</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    *Foco total em redução de Churn e aumento de LTV.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <Button className="w-full bg-solveflow-green hover:bg-solveflow-green/90" asChild>
                  <a href="#contato">Quero Reduzir meu Churn</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SolveCS Highlight Section */}
      <section className="py-section-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                4 Sistemas Inteligentes Trabalhando Juntos.<br />
                <span className="text-solveflow-green">Um Único Objetivo: Zero Churn.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Automatize a jornada do seu cliente com uma régua de comunicação infalível, do onboarding à renovação.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[{
              icon: <Clipboard className="text-solveflow-green" size={32} />,
              title: "Onboarding Programado (Dias 0-7)",
              problem: "Clientes cancelam porque não sabem usar o produto e ninguém ensinou.",
              solution: "Entrega uma sequência lógica de instruções, PDFs e vídeos tutoriais direto no WhatsApp do cliente. Garante que ele receba todo o material necessário para começar, sem seu time precisar enviar manualmente.",
              result: "Cliente educado e ativado na primeira semana."
            }, {
              icon: <LifeBuoy className="text-solveflow-green" size={32} />,
              title: "Suporte Nível 1 (24/7)",
              problem: "Clientes esperam horas por uma resposta simples.",
              solution: "Resolve dúvidas frequentes sobre o produto e financeiro em 2 segundos, 24h por dia. Se o problema for crítico, ele escala imediatamente para um humano com todo o contexto da conversa.",
              result: "Fim da fila de espera e time focado apenas em casos complexos."
            }, {
              icon: <Calendar className="text-solveflow-green" size={32} />,
              title: "Régua de Follow-up (Preventivo)",
              problem: 'Sua empresa "esquece" do cliente e só aparece para cobrar a renovação.',
              solution: "Executa check-ins automáticos em datas estratégicas definidas por você (ex: 30, 60, 90 dias). O sistema pergunta se está tudo bem e, ao detectar qualquer palavra de insatisfação na resposta, alerta seu time na hora.",
              result: "Relacionamento constante. O cliente sente que é cuidado o ano todo."
            }, {
              icon: <Star className="text-solveflow-green" size={32} />,
              title: "NPS Acionável",
              problem: "Pesquisas de satisfação que ninguém responde ou vê.",
              solution: "Dispara a pesquisa de NPS no WhatsApp na hora certa. Se o cliente der nota baixa, o sistema acolhe, pergunta o motivo e notifica seu gerente em tempo real para intervir e salvar a conta.",
              result: "Detratores são identificados antes de cancelarem."
            }].map((feature, index) => <div key={index} className="bg-white rounded-lg p-6 shadow-soft border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <h3 className="text-h4 font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-red-600 font-medium">🔴 Onde outros falham: {feature.problem}</p>
                    <p className="text-sm text-muted-foreground">🟢 O que o SolveCS faz: {feature.solution}</p>
                    <p className="text-sm font-semibold text-solveflow-green">✓ {feature.result}</p>
                  </div>
                </div>)}
            </div>

            <div className="mt-12 bg-white rounded-lg p-8 shadow-soft border border-border text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">
                "Não é Mágica. É Processo de CS Automatizado."
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Você define a régua de relacionamento. Nós implementamos a inteligência que garante que ela seja cumprida com 100% dos clientes, sem falha humana.
              </p>
              <Button className="mt-6 bg-solveflow-green hover:bg-solveflow-green/90" size="lg" asChild>
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
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                Não Tem CRM?{" "}
                <span className="text-gradient">Sem Problema.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Nós implementamos a estrutura completa para você profissionalizar sua operação comercial.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Para ter agentes de IA eficientes, você precisa de dados organizados.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Somos parceiros oficiais do <strong>Kommo CRM</strong> (antigo AmoCRM), a melhor ferramenta do mundo para vendas via WhatsApp. 
                  Nós entregamos o sistema configurado, personalizado para o seu funil de vendas e integrado aos nossos Agentes.
                </p>
                <h4 className="font-semibold text-foreground mb-4">O Que Sua Empresa Ganha:</h4>
                <ul className="space-y-3 mb-8">
                  {["Centralização do WhatsApp: Toda sua equipe atendendo em um único número, de forma organizada.", "Funil de Vendas Visual: Veja exatamente quantos leads estão em negociação e quanto dinheiro está na mesa.", "Histórico Completo: A IA registra cada conversa automaticamente. Nada se perde.", "Gestão à Vista: Relatórios de performance do time e das vendas em tempo real."].map((item, index) => <li key={index} className="flex items-start gap-3">
                      <Check className="text-solveflow-green flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-muted-foreground">{item}</span>
                    </li>)}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-8 border border-border">
                <h4 className="text-xl font-bold text-foreground mb-4 text-center">Setup de CRM Consultivo</h4>
                <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                  Não vendemos apenas a licença. Entregamos a <strong>Inteligência Comercial</strong>: 
                  desenhamos as etapas do seu funil, configuramos automações e treinamos seu time para usar a ferramenta.
                </p>
                <Button className="w-full bg-solveflow-blue hover:bg-solveflow-blue/90" size="lg" asChild>
                  <a href="#contato">Quero incluir CRM no meu projeto</a>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Já usa outro CRM? Também integramos com Pipedrive, HubSpot e outros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodologia" className="py-section-lg bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Metodologia de Implementação Consultiva
            </h2>
            <p className="text-lg text-muted-foreground">
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
            }].map((item, index) => <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-solveflow-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-h4 font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-solveflow-blue font-medium mb-3">⏱️ {item.time}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>)}
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

      {/* Results Section */}
      <section className="py-section-lg bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
              Resultados Que Falam Mais Que Promessas
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja como transformamos gargalos operacionais em lucro líquido usando nossos Agentes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            tag: "Agente de Atendimento",
            tagColor: "bg-blue-100 text-solveflow-blue",
            icon: <ShoppingBag className="text-pink-500" size={32} />,
            title: "O E-commerce Sobrecarregado",
            problem: 'A equipe gastava 4 horas por dia respondendo "Qual o valor do frete?" e "Tem estoque?". Nos finais de semana, 100% dos leads ficavam sem resposta até segunda-feira.',
            solution: "Implementamos o Agente de Atendimento integrado ao estoque e frete.",
            results: ["Zero espera: Clientes respondidos em 2 segundos, inclusive domingo às 23h.", "Economia: Redução de 90h/mês da equipe de suporte.", "Venda: Aumento de 15% na conversão por resposta imediata."]
          }, {
            tag: "Agente SDR",
            tagColor: "bg-purple-100 text-solveflow-purple",
            icon: <Briefcase className="text-solveflow-blue" size={32} />,
            title: "A Consultoria B2B",
            problem: "Marketing gerava 50 leads/dia, mas os vendedores demoravam horas para chamar. Resultado: falavam com leads frios ou curiosos sem dinheiro, desperdiçando tempo de senior.",
            solution: "Agente SDR qualificando via BANT (Orçamento, Autoridade, Necessidade, Tempo) instantaneamente.",
            results: ["Filtro: 70% dos curiosos descartados automaticamente.", "Eficiência: Vendedores só recebem leads prontos para fechar.", "Agenda: 3x mais reuniões qualificadas agendadas na mesma semana."]
          }, {
            tag: "SolveCS (Retenção)",
            tagColor: "bg-green-100 text-solveflow-green",
            icon: <Laptop className="text-solveflow-green" size={32} />,
            title: "O SaaS de Assinatura",
            problem: "Churn alto (8%) porque os clientes assinavam, não entendiam como usar a ferramenta e cancelavam no segundo mês sem avisar.",
            solution: "Régua de Onboarding automatizada via WhatsApp + Monitoramento de risco.",
            results: ["Ativação: 95% dos novos clientes completam o setup na 1ª semana.", "Retenção: Redução do Churn para 4.5% em 90 dias.", "ROI: R$ 12.000 preservados mensalmente em contratos que seriam perdidos."]
          }].map((useCase, index) => <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-soft border border-border">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${useCase.tagColor}`}>
                  {useCase.tag}
                </span>
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                  {useCase.icon}
                </div>
                <h3 className="text-h4 font-semibold text-foreground mb-4">{useCase.title}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">🔴 O Problema:</p>
                    <p className="text-sm text-muted-foreground">{useCase.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-solveflow-green mb-1">🟢 A Solução Solveflow:</p>
                    <p className="text-sm text-muted-foreground">{useCase.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">📈 O Resultado:</p>
                    <ul className="space-y-1">
                      {useCase.results.map((result, idx) => <li key={idx} className="text-sm text-muted-foreground">• {result}</li>)}
                    </ul>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-section-lg bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold text-foreground mb-4">
                Perguntas Frequentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {/* Sobre o Funcionamento */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Sobre o Funcionamento</p>
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
            }].map((faq, index) => <AccordionItem key={`func-${index}`} value={`func-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}

              {/* Sobre Custos e Mensalidade */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Sobre Custos e Mensalidade</p>
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
            }].map((faq, index) => <AccordionItem key={`custo-${index}`} value={`custo-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}

              {/* Técnico e Implementação */}
              <div className="mb-6 mt-8">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Técnico e Implementação</p>
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
            }].map((faq, index) => <AccordionItem key={`tec-${index}`} value={`tec-${index}`} className="border border-border rounded-lg px-6 bg-white">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
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
                    Seu nome
                  </label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input type="tel" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all" placeholder="(47) 99999-9999" value={formData.whatsapp} onChange={e => setFormData({
                  ...formData,
                  whatsapp: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all" placeholder="Nome da sua empresa" value={formData.company} onChange={e => setFormData({
                  ...formData,
                  company: e.target.value
                })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qual agente te interessa?
                  </label>
                  <select required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solveflow-blue focus:border-transparent transition-all text-gray-900 bg-white" value={formData.interest} onChange={e => setFormData({
                  ...formData,
                  interest: e.target.value
                })}>
                    <option value="" className="text-gray-500">Selecione uma opção</option>
                    <option value="atendimento" className="text-gray-900">Agente de Atendimento</option>
                    <option value="sdr" className="text-gray-900">Agente SDR (Qualificação)</option>
                    <option value="cs" className="text-gray-900">SolveCS (Retenção)</option>
                    <option value="crm" className="text-gray-900">CRM Kommo + Agente</option>
                    <option value="outro" className="text-gray-900">Outro / Não sei ainda</option>
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full bg-solveflow-green hover:bg-solveflow-green/90 text-lg py-6">
                  Falar com Especialista
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <p className="text-blue-200 mb-4">— OU —</p>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
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
                Consultoria de IA que automatiza sua operação com agentes inteligentes para WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#produtos" className="hover:text-white transition-colors">Agente de Atendimento</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Agente SDR</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">SolveCS™</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Implantação Kommo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#metodologia" className="hover:text-white transition-colors">Metodologia</a></li>
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
                  <span>(47) 99944-3087</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>contato@solveflow.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>Jaraguá do Sul, SC</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Solveflow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;