
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ArrowRight, ArrowUp, ArrowDown, Brain, MessageSquare, Users, BarChart2 } from "lucide-react";

// Dados mockados para o dashboard
const pieData = [
  { name: "Resolvidos", value: 540, color: "#16a34a" },
  { name: "Em Progresso", value: 210, color: "#f59e0b" },
  { name: "Aguardando", value: 150, color: "#6366f1" },
  { name: "Novos", value: 100, color: "#3b82f6" },
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua plataforma de helpdesk
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Este Mês</Button>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,024</div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                12%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +120 desde o último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Resolução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">87%</div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                4%
              </div>
            </div>
            <Progress value={87} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2.4h</div>
              <div className="flex items-center text-sm text-red-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -18min desde o último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolvidos por IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">62%</div>
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
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="ai">Análise IA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Tickets</CardTitle>
                <CardDescription>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Tickets</CardTitle>
                <CardDescription>
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
                      <Bar dataKey="tickets" name="Tickets Criados" fill="#3b82f6" />
                      <Bar dataKey="resolved" name="Tickets Resolvidos" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">312</div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    15 novos este mês
                  </p>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Total de Mensagens</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4,826</div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    +18% vs. mês passado
                  </p>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Satisfação do Cliente</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">94%</div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    Baseado em 720 avaliações
                  </p>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tickets">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets por Categoria</CardTitle>
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
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Prioridade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Baixa", value: 380, color: "#3b82f6" },
                            { name: "Média", value: 460, color: "#f59e0b" },
                            { name: "Alta", value: 190, color: "#ef4444" },
                            { name: "Crítica", value: 30, color: "#7f1d1d" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Fonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Web", value: 560, color: "#6366f1" },
                            { name: "E-mail", value: 320, color: "#3b82f6" },
                            { name: "WhatsApp", value: 180, color: "#22c55e" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Processados pela IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiStats.processedTickets}</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    15% do total
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resolvidos Automaticamente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiStats.autoResolved}</div>
                  <Progress value={(aiStats.autoResolved / aiStats.processedTickets) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tempo Médio de Processamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiStats.timeAverage}</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    30% mais rápido
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa de Sucesso da IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{aiStats.successRate}%</div>
                  <Progress value={aiStats.successRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Desempenho da IA ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Taxa de sucesso e velocidade de resposta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jan", success: 68, time: 5.8 },
                        { month: "Fev", success: 70, time: 5.4 },
                        { month: "Mar", success: 72, time: 5.0 },
                        { month: "Abr", success: 75, time: 4.6 },
                        { month: "Mai", success: 76, time: 4.4 },
                        { month: "Jun", success: 78, time: 4.2 },
                      ]}
                    >
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#f59e0b"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="success"
                        name="Taxa de Sucesso (%)"
                        fill="#6366f1"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="time"
                        name="Tempo Médio (min)"
                        fill="#f59e0b"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>Top Consultas à IA</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Como redefinir minha senha?",
                      "Não consigo fazer login no sistema",
                      "Como exportar relatórios para Excel?",
                      "O sistema está lento ao carregar",
                      "Como configurar notificações por e-mail?",
                    ].map((query, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <span>{query}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>Categorias Mais Automatizadas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { name: "Redefinição de Senha", rate: 94 },
                      { name: "Dúvidas sobre Faturamento", rate: 82 },
                      { name: "Solicitações de Relatórios", rate: 76 },
                      { name: "Problemas de Login", rate: 68 },
                      { name: "Configurações de Conta", rate: 65 },
                    ].map((category, index) => (
                      <li key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span className="font-medium">{category.rate}%</span>
                        </div>
                        <Progress
                          value={category.rate}
                          className="h-2"
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
