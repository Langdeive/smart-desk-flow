
import { updateTicketAIStatus, getTicketsNeedingAIProcessing } from "@/services/ticketService";
import { createMultipleSuggestedResponses } from "@/services/suggestedResponseService";
import { Ticket, TicketPriority } from "@/types";
import { toast } from "sonner";

// Interface para resposta do processamento de IA
interface AIProcessingResult {
  aiClassification: string;
  suggestedPriority: TicketPriority;
  needsAdditionalInfo: boolean;
  confidenceScore: number;
  suggestedResponses: Array<{
    message: string;
    confidence: number;
  }>;
}

// Simula o processamento de IA de um ticket
// Na implementação real, isso chamaria um serviço externo de IA
export const processTicketWithAI = async (ticket: Ticket): Promise<boolean> => {
  try {
    console.log(`Processando ticket ${ticket.id} com IA...`);
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular análise de IA
    const aiResult: AIProcessingResult = await simulateAIAnalysis(ticket);
    
    // Atualizar o status de IA do ticket
    await updateTicketAIStatus(
      ticket.id,
      true, // aiProcessed
      aiResult.confidenceScore < 0.8, // needsHumanReview
      aiResult.aiClassification,
      aiResult.suggestedPriority
    );
    
    // Criar sugestões de resposta
    if (aiResult.suggestedResponses.length > 0) {
      await createMultipleSuggestedResponses(
        ticket.id,
        aiResult.suggestedResponses
      );
    }
    
    console.log(`Ticket ${ticket.id} processado com sucesso pela IA`);
    return true;
    
  } catch (error) {
    console.error(`Erro ao processar ticket ${ticket.id} com IA:`, error);
    toast.error("Falha no processamento de IA do ticket");
    return false;
  }
};

// Processa tickets pendentes em lote
export const processTicketBatch = async (limit: number = 5): Promise<{
  processed: number;
  failed: number;
}> => {
  try {
    const tickets = await getTicketsNeedingAIProcessing();
    const batchTickets = tickets.slice(0, limit);
    
    console.log(`Processando lote de ${batchTickets.length} tickets...`);
    
    let processed = 0;
    let failed = 0;
    
    for (const ticket of batchTickets) {
      const success = await processTicketWithAI(ticket);
      if (success) {
        processed++;
      } else {
        failed++;
      }
    }
    
    return { processed, failed };
    
  } catch (error) {
    console.error("Erro ao processar lote de tickets:", error);
    return { processed: 0, failed: 0 };
  }
};

// Função que simula a análise de IA (será substituída por integração real)
const simulateAIAnalysis = async (ticket: Ticket): Promise<AIProcessingResult> => {
  // Análise simulada baseada no título e descrição do ticket
  const text = `${ticket.title} ${ticket.description}`.toLowerCase();
  
  // Determinação da classificação
  let aiClassification = "general_inquiry";
  if (text.includes("erro") || text.includes("bug") || text.includes("não funciona")) {
    aiClassification = "technical_issue";
  } else if (text.includes("recurso") || text.includes("implementar") || text.includes("adicionar")) {
    aiClassification = "feature_request";
  } else if (text.includes("cobranç") || text.includes("pagamento") || text.includes("fatura")) {
    aiClassification = "billing";
  }
  
  // Determinação de prioridade
  let suggestedPriority: TicketPriority = "medium";
  if (text.includes("urgente") || text.includes("crítico") || text.includes("emergência")) {
    suggestedPriority = "critical";
  } else if (text.includes("importante") || text.includes("grave")) {
    suggestedPriority = "high";
  } else if (text.includes("baixa") || text.includes("quando puder")) {
    suggestedPriority = "low";
  }
  
  // Avaliação de informações suficientes
  const needsAdditionalInfo = text.length < 30 || 
                           !text.includes(" ") ||
                           (text.split(" ").length < 5);
  
  // Cálculo do score de confiança
  let confidenceScore = 0.7;
  if (text.length > 100) confidenceScore += 0.15;
  if (!needsAdditionalInfo) confidenceScore += 0.1;
  if (text.includes("?")) confidenceScore -= 0.05;
  
  // Gerar sugestões de resposta
  const suggestedResponses = [];
  
  if (aiClassification === "technical_issue") {
    suggestedResponses.push({
      message: "Obrigado por relatar esse problema. Nossa equipe técnica já foi notificada e está trabalhando para resolver o mais rápido possível. Vamos manter você atualizado sobre o progresso.",
      confidence: confidenceScore - 0.05
    });
    
    suggestedResponses.push({
      message: "Identificamos o problema relatado. Para nos ajudar a resolvê-lo mais rapidamente, poderia nos informar a versão do sistema que está utilizando e os passos exatos para reproduzir o erro?",
      confidence: confidenceScore - 0.1
    });
  } else if (aiClassification === "feature_request") {
    suggestedResponses.push({
      message: "Agradecemos sua sugestão! Ela foi registrada e será avaliada pela nossa equipe de produto. Valorizamos muito o feedback dos nossos usuários para continuarmos melhorando a plataforma.",
      confidence: confidenceScore
    });
  } else if (aiClassification === "billing") {
    suggestedResponses.push({
      message: "Recebemos sua consulta sobre faturamento. Para melhor atendê-lo, poderia confirmar os detalhes da sua conta e especificar o período do faturamento em questão?",
      confidence: confidenceScore - 0.15
    });
  } else {
    suggestedResponses.push({
      message: "Agradecemos seu contato. Nossa equipe está analisando sua solicitação e retornaremos em breve com uma resposta. Caso tenha informações adicionais que possam nos ajudar, não hesite em compartilhar.",
      confidence: confidenceScore - 0.2
    });
  }
  
  return {
    aiClassification,
    suggestedPriority,
    needsAdditionalInfo,
    confidenceScore,
    suggestedResponses
  };
};

// Função para reiniciar o processamento de um ticket (por exemplo, após edição)
export const reprocessTicket = async (ticketId: string): Promise<boolean> => {
  try {
    // Primeiro, busca o ticket atual
    const response = await fetch(`/api/tickets/${ticketId}`);
    if (!response.ok) throw new Error('Falha ao buscar ticket');
    const ticket = await response.json();
    
    // Marca como não processado
    await updateTicketAIStatus(
      ticketId,
      false, // aiProcessed
      true   // needsHumanReview
    );
    
    // Processa novamente
    return await processTicketWithAI(ticket);
  } catch (error) {
    console.error(`Erro ao reprocessar ticket ${ticketId}:`, error);
    return false;
  }
};
