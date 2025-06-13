
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle } from '@/types';
import { useAuth } from './useAuth';
import { useSemanticSearch } from './useSemanticSearch';

export interface KnowledgeArticleInput {
  title: string;
  content: string;
  keywords: string[];
  isPublic: boolean;
}

export const useKnowledgeArticles = (searchTerm?: string) => {
  const { companyId } = useAuth();
  const queryClient = useQueryClient();
  const { generateEmbedding } = useSemanticSearch();

  // Fetch articles with optional search
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['knowledge-articles', companyId, searchTerm],
    queryFn: async () => {
      if (!companyId) return [];

      let query = supabase
        .from('knowledge_articles')
        .select('*')
        .eq('company_id', companyId)
        .order('updated_at', { ascending: false });

      // Add search functionality
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,keywords.cs.{${searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map((article): KnowledgeArticle => ({
        id: article.id,
        title: article.title,
        content: article.content,
        keywords: article.keywords || [],
        companyId: article.company_id,
        createdAt: new Date(article.created_at),
        updatedAt: new Date(article.updated_at),
        isPublic: article.is_public,
      })) || [];
    },
    enabled: !!companyId,
  });

  // Create article mutation with embedding generation
  const createArticle = useMutation({
    mutationFn: async (articleData: KnowledgeArticleInput) => {
      if (!companyId) throw new Error('Company ID not found');

      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert({
          title: articleData.title,
          content: articleData.content,
          keywords: articleData.keywords,
          company_id: companyId,
          is_public: articleData.isPublic,
        })
        .select()
        .single();

      if (error) throw error;

      // Generate embedding for the new article
      try {
        await generateEmbedding(data.id, articleData.title, articleData.content);
        console.log('✅ Embedding generated for new article:', data.id);
      } catch (embeddingError) {
        console.warn('⚠️ Failed to generate embedding for article:', data.id, embeddingError);
        // Don't fail the whole operation if embedding generation fails
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
  });

  // Update article mutation with embedding regeneration
  const updateArticle = useMutation({
    mutationFn: async ({ id, ...articleData }: KnowledgeArticleInput & { id: string }) => {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .update({
          title: articleData.title,
          content: articleData.content,
          keywords: articleData.keywords,
          is_public: articleData.isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Regenerate embedding for the updated article
      try {
        await generateEmbedding(id, articleData.title, articleData.content);
        console.log('✅ Embedding regenerated for updated article:', id);
      } catch (embeddingError) {
        console.warn('⚠️ Failed to regenerate embedding for article:', id, embeddingError);
        // Don't fail the whole operation if embedding generation fails
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
  });

  // Delete article mutation
  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      // Delete from documents table first (for embeddings) using RPC function
      const { error: docError } = await supabase
        .rpc('delete_documents_by_article_id', { article_id: id });

      if (docError) {
        console.warn('⚠️ Failed to delete document embedding:', docError);
        // Continue with article deletion even if document deletion fails
      }

      // Delete the article
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
  });

  return {
    articles: articles || [],
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

// Hook for fetching a single article
export const useKnowledgeArticle = (id: string) => {
  return useQuery({
    queryKey: ['knowledge-article', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        keywords: data.keywords || [],
        companyId: data.company_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isPublic: data.is_public,
      } as KnowledgeArticle;
    },
    enabled: !!id,
  });
};
