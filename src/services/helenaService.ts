
import { supabase } from '@/integrations/supabase/client';
import { PendingArticle, ArticleGenerationLog, ApproveArticleData } from '@/types/helena';

/**
 * Serviço para gerenciar artigos pendentes da Helena
 */

export const helenaService = {
  /**
   * Busca todos os artigos pendentes para uma empresa
   */
  async getPendingArticles(companyId: string): Promise<PendingArticle[]> {
    const { data, error } = await supabase
      .from('pending_articles')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar artigos pendentes:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Busca um artigo pendente específico
   */
  async getPendingArticleById(id: string): Promise<PendingArticle | null> {
    const { data, error } = await supabase
      .from('pending_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      console.error('Erro ao buscar artigo pendente:', error);
      throw error;
    }

    return data;
  },

  /**
   * Aprova um artigo pendente e o publica na base de conhecimento
   */
  async approveArticle(
    pendingArticleId: string,
    agentId: string,
    approvalData: ApproveArticleData = {}
  ): Promise<string> {
    const { data, error } = await supabase.rpc('approve_pending_article', {
      p_pending_article_id: pendingArticleId,
      p_agent_id: agentId,
      p_final_title: approvalData.final_title || null,
      p_final_content: approvalData.final_content || null,
      p_final_keywords: approvalData.final_keywords || null,
      p_is_public: approvalData.is_public ?? true
    });

    if (error) {
      console.error('Erro ao aprovar artigo:', error);
      throw error;
    }

    return data; // Retorna o ID do artigo publicado
  },

  /**
   * Rejeita um artigo pendente
   */
  async rejectArticle(
    pendingArticleId: string,
    agentId: string,
    rejectionReason: string
  ): Promise<void> {
    const { error } = await supabase.rpc('reject_pending_article', {
      p_pending_article_id: pendingArticleId,
      p_agent_id: agentId,
      p_rejection_reason: rejectionReason
    });

    if (error) {
      console.error('Erro ao rejeitar artigo:', error);
      throw error;
    }
  },

  /**
   * Busca logs de geração de artigos para um ticket específico
   */
  async getArticleGenerationLogs(ticketId: string): Promise<ArticleGenerationLog[]> {
    const { data, error } = await supabase
      .from('article_generation_logs')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar logs de geração:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Busca estatísticas dos artigos da Helena para uma empresa
   */
  async getHelenaStats(companyId: string): Promise<{
    total_pending: number;
    total_approved: number;
    total_rejected: number;
    avg_confidence_score: number;
  }> {
    const { data, error } = await supabase
      .from('pending_articles')
      .select('status, confidence_score')
      .eq('company_id', companyId);

    if (error) {
      console.error('Erro ao buscar estatísticas da Helena:', error);
      throw error;
    }

    const stats = {
      total_pending: 0,
      total_approved: 0,
      total_rejected: 0,
      avg_confidence_score: 0
    };

    if (data && data.length > 0) {
      stats.total_pending = data.filter(item => item.status === 'pending').length;
      stats.total_approved = data.filter(item => item.status === 'approved').length;
      stats.total_rejected = data.filter(item => item.status === 'rejected').length;
      
      const confidenceScores = data.map(item => Number(item.confidence_score)).filter(score => !isNaN(score));
      stats.avg_confidence_score = confidenceScores.length > 0 
        ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length 
        : 0;
    }

    return stats;
  }
};
