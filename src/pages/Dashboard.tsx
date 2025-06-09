import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ArrowRight, ArrowUp, ArrowDown, Brain, MessageSquare, Users, BarChart2 } from "lucide-react";

// Dados mockados para o dashboard
const pieData = [
  { name: "Resolvidos", value: 540, color: "#10B981" },
  { name: "Em Progresso", value: 210, color: "#06B6D4" },
  { name: "Aguardando", value: 150, color: "#6366f1" },
  { name: "Novos", value: 100, color: "#1E3A8A" },
];

const barData = [
  { name: "Jan", tickets: 65, resolved: 40 },
  { name: "Fev", tickets: 80, resolved: 55 },
  { name: "Mar", tickets: 95, resolved: 70 },
  { name: "Abr", tickets: 120, resolved: 90 },
  { name: "Mai", tickets: 150, resolved: 110 },
  { name: "Jun", tickets: 130, resolved: 105 },
];

const aiStats = {
  processedTickets: 870,
  autoResolved: 540,
  timeAverage: "4.2 min",
  successRate: 78,
};

const Dashboard = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, rgba(30, 58, 138, 0.02) 50%, rgba(6, 182, 212, 0.02) 100%)',
        minHeight: '100vh'
      }}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-medium mt-2">
              Visão geral da sua plataforma de helpdesk
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-turquoise-vibrant text-turquoise-vibrant hover:bg-turquoise-vibrant hover:text-white"
              style={{ borderColor: '#06B6D4', color: '#06B6D4' }}
            >
              Este Mês
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-deep text-blue-deep hover:bg-blue-deep hover:text-white"
              style={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}
            >
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card 
            className="modern-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
              borderColor: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#475569' }}>
                Total de Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>1,024</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  12%
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                +120 desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="modern-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(30, 58, 138, 0.02) 100%)',
              borderColor: 'rgba(30, 58, 138, 0.2)',
              border: '1px solid rgba(30, 58, 138, 0.2)'
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#475569' }}>
                Taxa de Resolução
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>87%</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  4%
                </div>
              </div>
              <Progress value={87} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card 
            className="modern-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(124, 58, 237, 0.02) 100%)',
              borderColor: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.2)'
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#475569' }}>
                Tempo Médio de Resposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>2.4h</div>
                <div className="flex items-center text-sm text-red-600">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  5%
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                -18min desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="modern-card"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
              borderColor: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#475569' }}>
                Resolvidos por IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>62%</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  8%
                </div>
              </div>
              <Progress value={62} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList 
            className="mb-4"
            style={{
              background: 'linear-gradient(135deg, #F1F5F9 0%, #ffffff 100%)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}
          >
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="ai">Análise IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F1F5F9 100%)',
                  border: '1px solid rgba(30, 58, 138, 0.1)'
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-text">Distribuição de Tickets</CardTitle>
                  <CardDescription style={{ color: '#64748B' }}>
                    Status atual de todos os tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F1F5F9 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.1)'
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-text">Histórico de Tickets</CardTitle>
                  <CardDescription style={{ color: '#64748B' }}>
                    Tickets criados vs. resolvidos nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tickets" name="Tickets Criados" fill="#1E3A8A" />
                        <Bar dataKey="resolved" name="Tickets Resolvidos" fill="#06B6D4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
                  borderColor: 'rgba(6, 182, 212, 0.2)',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Clientes Ativos</CardTitle>
                    <Users className="h-4 w-4 text-turquoise-vibrant" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-deep">312</div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      15 novos este mês
                    </p>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-turquoise-vibrant/10">
                      <ArrowRight className="h-4 w-4 text-turquoise-vibrant" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(30, 58, 138, 0.02) 100%)',
                  borderColor: 'rgba(30, 58, 138, 0.2)',
                  border: '1px solid rgba(30, 58, 138, 0.2)'
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Total de Mensagens</CardTitle>
                    <MessageSquare className="h-4 w-4 text-blue-deep" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-deep">4,826</div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      +18% vs. mês passado
                    </p>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-deep/10">
                      <ArrowRight className="h-4 w-4 text-blue-deep" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(124, 58, 237, 0.02) 100%)',
                  borderColor: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(124, 58, 237, 0.2)'
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Satisfação do Cliente</CardTitle>
                    <BarChart2 className="h-4 w-4 text-purple-intense" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-deep">94%</div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      Baseado em 720 avaliações
                    </p>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-intense/10">
                      <ArrowRight className="h-4 w-4 text-purple-intense" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tickets">
            <div className="flex flex-col gap-6">
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
                  borderColor: 'rgba(6, 182, 212, 0.2)',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-text">Tickets por Categoria</CardTitle>
                  <CardDescription>
                    Distribuição dos tickets por tipo de solicitação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { name: "Problema Técnico", value: 450 },
                          { name: "Dúvida", value: 280 },
                          { name: "Solicitação de Recurso", value: 180 },
                          { name: "Faturamento", value: 90 },
                          { name: "Outro", value: 60 },
                        ]}
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className="modern-card"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
                    borderColor: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.2)'
                  }}
                >
                  <CardHeader>
                    <CardTitle className="gradient-text">Tickets por Prioridade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Baixa", value: 380, color: "#3b82f6" },
                              { name: "Média", value: 460, color: "#06B6D4" },
                              { name: "Alta", value: 190, color: "#7C3AED" },
                              { name: "Crítica", value: 30, color: "#EF4444" },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Baixa", value: 380, color: "#3b82f6" },
                              { name: "Média", value: 460, color: "#06B6D4" },
                              { name: "Alta", value: 190, color: "#7C3AED" },
                              { name: "Crítica", value: 30, color: "#EF4444" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="modern-card"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, rgba(124, 58, 237, 0.02) 100%)',
                    borderColor: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(124, 58, 237, 0.2)'
                  }}
                >
                  <CardHeader>
                    <CardTitle className="gradient-text">Performance da IA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tickets Processados</span>
                        <span className="text-lg font-bold text-purple-intense">{aiStats.processedTickets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Auto-resolvidos</span>
                        <span className="text-lg font-bold text-green-600">{aiStats.autoResolved}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tempo Médio</span>
                        <span className="text-lg font-bold text-blue-deep">{aiStats.timeAverage}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Taxa de Sucesso</span>
                        <span className="text-lg font-bold text-turquoise-vibrant">{aiStats.successRate}%</span>
                      </div>
                      <Progress value={aiStats.successRate} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(6, 182, 212, 0.02) 100%)',
                  borderColor: 'rgba(6, 182, 212, 0.2)',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Análise IA Detalhada
                  </CardTitle>
                  <CardDescription>
                    Métricas avançadas do processamento automático
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Classificação Automática</span>
                        <span className="text-2xl font-bold text-purple-intense">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                      <p className="text-xs text-muted-foreground">Precisão na categorização de tickets</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Detecção de Urgência</span>
                        <span className="text-2xl font-bold text-turquoise-vibrant">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                      <p className="text-xs text-muted-foreground">Acerto na priorização automática</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Respostas Sugeridas</span>
                        <span className="text-2xl font-bold text-blue-deep">76%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                      <p className="text-xs text-muted-foreground">Taxa de aprovação das sugestões</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="modern-card"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(124, 58, 237, 0.02) 100%)',
                  borderColor: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(124, 58, 237, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-text">Base de Conhecimento</CardTitle>
                  <CardDescription>
                    Status da base de conhecimento e aprendizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-turquoise-vibrant mb-2">1,247</div>
                      <p className="text-sm text-muted-foreground">Artigos na base</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">187</div>
                        <p className="text-xs text-muted-foreground">Novos este mês</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-deep">92%</div>
                        <p className="text-xs text-muted-foreground">Taxa utilização</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Categorias mais populares</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Problemas Técnicos</span>
                          <span className="font-medium">342 artigos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>FAQ Geral</span>
                          <span className="font-medium">218 artigos</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tutoriais</span>
                          <span className="font-medium">156 artigos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
