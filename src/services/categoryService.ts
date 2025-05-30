
import { supabase } from '@/integrations/supabase/client';
import { Category, CategoryInput } from '@/types/category';

export const categoryService = {
  /**
   * Busca todas as categorias de uma empresa
   */
  async getCompanyCategories(companyId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Erro ao carregar categorias');
    }

    return data || [];
  },

  /**
   * Busca categorias ativas formatadas para uso em selects
   */
  async getCategoriesForSelect(companyId: string): Promise<{ value: string; label: string; color?: string }[]> {
    const categories = await this.getCompanyCategories(companyId);
    
    return categories.map(category => ({
      value: category.key,
      label: category.name,
      color: category.color
    }));
  },

  /**
   * Cria uma nova categoria
   */
  async createCategory(companyId: string, categoryData: CategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        company_id: companyId,
        ...categoryData,
        is_default: false // Categorias criadas pelo usuário nunca são padrão
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      if (error.code === '23505') {
        throw new Error('Já existe uma categoria com essa chave');
      }
      throw new Error('Erro ao criar categoria');
    }

    return data;
  },

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(categoryId: string, categoryData: Partial<CategoryInput>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        ...categoryData,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error('Erro ao atualizar categoria');
    }

    return data;
  },

  /**
   * Desativa uma categoria (soft delete)
   */
  async deactivateCategory(categoryId: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId);

    if (error) {
      console.error('Error deactivating category:', error);
      throw new Error('Erro ao desativar categoria');
    }
  },

  /**
   * Busca uma categoria pelo key e company_id
   */
  async getCategoryByKey(companyId: string, key: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', companyId)
      .eq('key', key)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching category by key:', error);
      throw new Error('Erro ao buscar categoria');
    }

    return data;
  },

  /**
   * Verifica se uma categoria pode ser removida (não tem tickets associados)
   */
  async canDeleteCategory(categoryId: string): Promise<boolean> {
    // Busca a categoria para obter a key
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('key, company_id')
      .eq('id', categoryId)
      .single();

    if (categoryError || !category) {
      return false;
    }

    // Verifica se há tickets usando essa categoria
    const { count, error } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', category.company_id)
      .eq('category', category.key);

    if (error) {
      console.error('Error checking category usage:', error);
      return false;
    }

    return (count || 0) === 0;
  }
};
