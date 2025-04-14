
import { createClient } from '@supabase/supabase-js';
import type { Ticket } from '@/types';

// Esta função seria chamada quando um trigger de banco de dados é acionado
export const sendTicketToN8n = async (ticket: Ticket, n8nWebhookUrl: string) => {
  try {
    console.log('Enviando ticket para processamento n8n:', ticket.id);
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'ticket.created',
        data: ticket,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar para n8n: ${response.statusText}`);
    }

    console.log('Ticket enviado com sucesso para n8n:', ticket.id);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar ticket para n8n:', error);
    return { success: false, error };
  }
};

// Esta função seria usada para receber atualizações do n8n
export const processN8nUpdate = async (updateData: any) => {
  const { 
    ticketId, 
    aiClassification, 
    suggestedPriority, 
    suggestedKnowledgeArticles,
    aiResponse 
  } = updateData;
  
  // Configuração do cliente Supabase (em produção, isso seria feito via env vars)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Atualizar o ticket com os dados processados pela IA
    const { error } = await supabase
      .from('tickets')
      .update({
        category: aiClassification,
        priority: suggestedPriority,
        aiProcessed: true,
        aiSuggestion: aiResponse,
        updatedAt: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    // Publicar evento interno no sistema
    const eventData = {
      type: 'ticket.ai_processed',
      ticketId,
      timestamp: new Date().toISOString(),
      suggestedArticles: suggestedKnowledgeArticles
    };
    
    // Em um sistema completo, aqui publicaríamos o evento para outros serviços
    console.log('Evento publicado:', eventData);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao processar atualização do n8n:', error);
    return { success: false, error };
  }
};
