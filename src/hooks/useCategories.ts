
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { Category, CategoryInput } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

export const useCategories = (companyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categories', companyId],
    queryFn: () => categoryService.getCompanyCategories(companyId!),
    enabled: !!companyId,
  });

  const createMutation = useMutation({
    mutationFn: ({ companyId, categoryData }: { companyId: string; categoryData: CategoryInput }) =>
      categoryService.createCategory(companyId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      toast({
        title: "Categoria criada",
        description: "Nova categoria foi criada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, categoryData }: { categoryId: string; categoryData: Partial<CategoryInput> }) =>
      categoryService.updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      toast({
        title: "Categoria atualizada",
        description: "Categoria foi atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (categoryId: string) => categoryService.deactivateCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
      toast({
        title: "Categoria removida",
        description: "Categoria foi desativada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover categoria",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deactivateCategory: deactivateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
  };
};

export const useCategoriesForSelect = (companyId?: string) => {
  return useQuery({
    queryKey: ['categories-select', companyId],
    queryFn: () => categoryService.getCategoriesForSelect(companyId!),
    enabled: !!companyId,
  });
};
