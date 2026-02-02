import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Clock, DollarSign, TrendingUp, AlertTriangle, Calendar, Download, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TASKS = [
  { id: "triagem", label: "Triagem de leads" },
  { id: "agendamento", label: "Agendamento de reuniões" },
  { id: "onboarding", label: "Onboarding de alunos" },
  { id: "respostas", label: "Respostas de dúvidas frequentes" },
  { id: "cortes", label: "Produção de cortes de vídeo" },
  { id: "certificados", label: "Emissão de certificados" },
];

interface FormData {
  valorHora: string;
  quantidadeAlunos: string;
  tarefasManuais: string[];
  horasSemanais: number;
}

const DiagnosticoROI = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    valorHora: "",
    quantidadeAlunos: "",
    tarefasManuais: [],
    horasSemanais: 10,
  });

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  // Cálculos
  const horasSalvasMes = formData.horasSemanais * 4.3;
  const recuperacaoAnual = formData.horasSemanais * parseFloat(formData.valorHora || "0") * 52;
  const aumentoCapacidade = formData.tarefasManuais.length > 3 ? 30 : 0;

  const chartData = [
    { name: "Cenário Atual", horas: formData.horasSemanais * 4.3, fill: "#ef4444" },
    { name: "Cenário IA", horas: Math.max(2, formData.horasSemanais * 4.3 * 0.2), fill: "#00D4AA" },
  ];

  const getDiagnosticoTexto = () => {
    if (formData.horasSemanais > 25) {
      return "🚨 Sua operação está em risco crítico de burnout. Você está investindo tempo demais em tarefas que poderiam ser automatizadas.";
    } else if (formData.horasSemanais > 15) {
      return "⚠️ Sua operação está em risco de estagnação. O tempo gasto em tarefas manuais está limitando seu crescimento.";
    } else if (formData.horasSemanais > 8) {
      return "📊 Sua operação tem espaço para otimização. Automatizar essas tarefas pode acelerar significativamente seu crescimento.";
    }
    return "✅ Sua operação está relativamente otimizada, mas ainda há oportunidades de automação para escalar.";
  };

  const handleTaskChange = (taskId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tarefasManuais: checked
        ? [...prev.tarefasManuais, taskId]
        : prev.tarefasManuais.filter(id => id !== taskId)
    }));
  };

  const canProceed = () => {
    if (step === 2) {
      return formData.valorHora && formData.quantidadeAlunos;
    }
    return true;
  };

  const nextStep = () => {
    if (step < totalSteps && canProceed()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-deep to-slate-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Diagnóstico Express</span>
            <span className="text-sm text-turquoise-vibrant font-medium">Passo {step} de {totalSteps}</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/10" />
        </div>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Step 1: Landing */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Calculadora de ROI para Mentores</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Quanto custa o seu{" "}
              <span className="block mt-2 text-turquoise-vibrant">
                tempo operacional?
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Descubra quantas horas por mês a IA pode devolver para o seu negócio de mentoria.
            </p>

            <Button 
              size="lg" 
              onClick={nextStep}
              className="bg-gradient-to-r from-turquoise-vibrant to-blue-deep hover:from-turquoise-vibrant/90 hover:to-blue-deep/90 text-white text-lg px-10 py-7 shadow-glow-cyan font-semibold group"
            >
              Iniciar Diagnóstico
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-white/40 mt-6">
              ⏱️ Leva menos de 2 minutos
            </p>
          </div>
        )}

        {/* Step 2: Coleta de Dados */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
              Vamos entender sua operação
            </h2>
            <p className="text-white/60 text-center mb-10">
              Preencha os dados abaixo para calcular seu potencial de automação
            </p>

            <div className="space-y-8">
              {/* Seção 1: O Valor do Mentor */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-turquoise-vibrant" />
                    O Valor do Mentor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="valorHora" className="text-white/80">
                      Qual o valor da sua hora técnica/estratégica? (R$)
                    </Label>
                    <Input
                      id="valorHora"
                      type="number"
                      placeholder="Ex: 500"
                      value={formData.valorHora}
                      onChange={(e) => setFormData(prev => ({ ...prev, valorHora: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidadeAlunos" className="text-white/80">
                      Quantos alunos/leads você atende por mês?
                    </Label>
                    <Input
                      id="quantidadeAlunos"
                      type="number"
                      placeholder="Ex: 50"
                      value={formData.quantidadeAlunos}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantidadeAlunos: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Seção 2: O Gargalo Operacional */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    O Gargalo Operacional
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Quais destas tarefas você ou seu time fazem manualmente?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TASKS.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={task.id}
                          checked={formData.tarefasManuais.includes(task.id)}
                          onCheckedChange={(checked) => handleTaskChange(task.id, checked as boolean)}
                          className="border-white/30 data-[state=checked]:bg-turquoise-vibrant data-[state=checked]:border-turquoise-vibrant"
                        />
                        <Label htmlFor={task.id} className="text-white/80 cursor-pointer">
                          {task.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Seção 3: Carga Horária */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-intense" />
                    Carga Horária
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-white/80">
                        Quantas horas por semana sua operação gasta nessas tarefas manuais?
                      </Label>
                      <span className="text-2xl font-bold text-turquoise-vibrant">
                        {formData.horasSemanais}h
                      </span>
                    </div>
                    <Slider
                      value={[formData.horasSemanais]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, horasSemanais: value[0] }))}
                      min={1}
                      max={40}
                      step={1}
                      className="[&_[role=slider]]:bg-turquoise-vibrant [&_[role=slider]]:border-turquoise-vibrant"
                    />
                    <div className="flex justify-between text-sm text-white/40">
                      <span>1h</span>
                      <span>40h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-10">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar
              </Button>
              <Button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-turquoise-vibrant to-blue-deep hover:from-turquoise-vibrant/90 hover:to-blue-deep/90 text-white"
              >
                Ver Resultados
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Dashboard de Resultado */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Seu Diagnóstico Express
              </h2>
              <p className="text-white/60">
                Baseado nos dados informados, aqui está seu potencial de automação
              </p>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-slate-800 border-turquoise-vibrant/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-turquoise-vibrant/20 rounded-xl">
                      <Clock className="w-6 h-6 text-turquoise-vibrant" />
                    </div>
                    <span className="text-white/70 text-sm">Horas Recuperáveis</span>
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {horasSalvasMes.toFixed(0)}h
                  </p>
                  <p className="text-turquoise-vibrant text-sm mt-1">por mês</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <DollarSign className="w-6 h-6 text-red-400" />
                    </div>
                    <span className="text-white/70 text-sm">Prejuízo Anual</span>
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {formatCurrency(recuperacaoAnual)}
                  </p>
                  <p className="text-red-400 text-sm mt-1">deixados na mesa</p>
                </CardContent>
              </Card>

              {aumentoCapacidade > 0 && (
                <Card className="bg-slate-800 border-purple-intense/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-intense/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-intense" />
                      </div>
                      <span className="text-white/70 text-sm">Aumento de Capacidade</span>
                    </div>
                    <p className="text-4xl font-bold text-white">
                      +{aumentoCapacidade}%
                    </p>
                    <p className="text-purple-intense text-sm mt-1">potencial de escala</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Gráfico de Comparação */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-10">
              <CardHeader>
                <CardTitle className="text-white">Comparativo: Cenário Atual vs IA</CardTitle>
                <CardDescription className="text-white/60">
                  Horas mensais gastas em tarefas operacionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number) => [`${value.toFixed(0)}h`, 'Horas/mês']}
                      />
                      <Bar dataKey="horas" radius={[0, 8, 8, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Diagnóstico Texto */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-10">
              <CardContent className="pt-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  {getDiagnosticoTexto()}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar
              </Button>
              <Button 
                onClick={nextStep}
                className="bg-gradient-to-r from-turquoise-vibrant to-blue-deep hover:from-turquoise-vibrant/90 hover:to-blue-deep/90 text-white"
              >
                Ver Próximos Passos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: CTA */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-turquoise-vibrant/10 border border-turquoise-vibrant/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-turquoise-vibrant" />
              <span className="text-sm text-turquoise-vibrant font-medium">Diagnóstico Concluído</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Este diagnóstico é uma estimativa.
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Quer o plano de execução para recuperar esse tempo?
            </p>

            {/* Resumo */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-10">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="text-white/60 text-sm">Horas Recuperáveis/mês</p>
                    <p className="text-2xl font-bold text-turquoise-vibrant">{horasSalvasMes.toFixed(0)}h</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Prejuízo Anual Estimado</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(recuperacaoAnual)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Tarefas Automatizáveis</p>
                    <p className="text-2xl font-bold text-white">{formData.tarefasManuais.length}</p>
                  </div>
                  {aumentoCapacidade > 0 && (
                    <div>
                      <p className="text-white/60 text-sm">Potencial de Escala</p>
                      <p className="text-2xl font-bold text-purple-intense">+{aumentoCapacidade}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-turquoise-vibrant to-blue-deep hover:from-turquoise-vibrant/90 hover:to-blue-deep/90 text-white text-lg px-8 py-6 shadow-glow-cyan font-semibold"
                asChild
              >
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 w-5 h-5" />
                  Agendar Reunião de Viabilidade
                </a>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => {
                  alert("Funcionalidade de download em PDF será implementada em breve!");
                }}
              >
                <Download className="mr-2 w-5 h-5" />
                Baixar Relatório em PDF
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => setStep(1)}
              className="mt-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Refazer Diagnóstico
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticoROI;
