
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle } from '@/types';
import { useAuth } from './useAuth';

interface SemanticSearchResult extends KnowledgeArticle {
  similarity: number;
  relevanceScore: number;
}

interface SemanticSearchResponse {
  success: boolean;
  results: SemanticSearchResult[];
  totalFound: number;
  relevantCount: number;
  query: string;
  threshold: number;
  error?: string;
}

export const useSemanticSearch = () => {
  const { companyId } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState<string>('');

  const searchKnowledge = async (
    query: string, 
    options: {
      limit?: number;
      similarityThreshold?: number;
    } = {}
  ): Promise<SemanticSearchResult[]> => {
    if (!companyId || !query.trim()) {
      return [];
    }

    setIsSearching(true);
    setLastQuery(query);

    try {
      console.log('🔍 Starting semantic search for:', query);

      const { data, error } = await supabase.functions.invoke('search-knowledge', {
        body: {
          query: query.trim(),
          companyId: companyId,
          limit: options.limit || 5,
          similarityThreshold: options.similarityThreshold || 0.7
        }
      });

      if (error) {
        console.error('❌ Semantic search error:', error);
        throw error;
      }

      const response = data as SemanticSearchResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Search failed');
      }

      console.log(`✅ Semantic search completed: ${response.relevantCount} relevant results`);
      
      setSearchResults(response.results);
      return response.results;

    } catch (error) {
      console.error('❌ Error in semantic search:', error);
      setSearchResults([]);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  const generateEmbedding = async (articleId: string, title: string, content: string): Promise<boolean> => {
    try {
      console.log('🔄 Generating embedding for article:', articleId);

      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: {
          articleId,
          title,
          content
        }
      });

      if (error) {
        console.error('❌ Embedding generation error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Embedding generation failed');
      }

      console.log('✅ Embedding generated successfully for article:', articleId);
      return true;

    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      throw error;
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setLastQuery('');
  };

  return {
    searchKnowledge,
    generateEmbedding,
    clearResults,
    isSearching,
    searchResults,
    lastQuery
  };
};
