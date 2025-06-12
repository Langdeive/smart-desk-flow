
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle } from '@/types';
import { useAuth } from './useAuth';

export interface KnowledgeArticleInput {
  title: string;
  content: string;
  keywords: string[];
  isPublic: boolean;
  ticketId?: string;
}

export const useKnowledgeArticles = (searchTerm?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch articles with optional search
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['knowledge-articles', user?.companyId, searchTerm],
    queryFn: async () => {
      if (!user?.companyId) return [];

      let query = supabase
        .from('knowledge_articles')
        .select('*')
        .eq('company_id', user.companyId)
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
    enabled: !!user?.companyId,
  });

  // Create article mutation
  const createArticle = useMutation({
    mutationFn: async (articleData: KnowledgeArticleInput) => {
      if (!user?.companyId) throw new Error('Company ID not found');

      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert({
          title: articleData.title,
          content: articleData.content,
          keywords: articleData.keywords,
          company_id: user.companyId,
          is_public: articleData.isPublic,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
  });

  // Update article mutation
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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles'] });
    },
  });

  // Delete article mutation
  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
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
  const { user } = useAuth();

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
