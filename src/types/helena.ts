
export interface PendingArticle {
  id: string;
  company_id: string;
  ticket_id: string;
  title: string;
  content: string;
  keywords: string[];
  confidence_score: number;
  analysis_summary?: string;
  similar_articles_found: any[]; // Explicitly typed as array
  status: 'pending' | 'approved' | 'rejected' | 'editing';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  published_article_id?: string;
}

export interface ArticleGenerationLog {
  id: string;
  company_id: string;
  ticket_id: string;
  event_type: string;
  details?: any;
  processing_time_ms?: number;
  helena_version: string;
  created_at: string;
}

export interface ApproveArticleData {
  final_title?: string;
  final_content?: string;
  final_keywords?: string[];
  is_public?: boolean;
}
