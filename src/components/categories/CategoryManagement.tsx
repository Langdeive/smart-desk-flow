
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { CategoryDialog } from './CategoryDialog';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

const CategoryManagement: React.FC = () => {
  const { companyId } = useAuth();
  const { categories, isLoading, createCategory, updateCategory, deactivateCategory } = useCategories(companyId);
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleCreateCategory = (categoryData: any) => {
    if (!companyId) return;
    createCategory({ companyId, categoryData });
    setIsDialogOpen(false);
  };

  const handleUpdateCategory = (categoryData: any) => {
    if (!editingCategory) return;
    updateCategory({ categoryId: editingCategory.id, categoryData });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      const canDelete = await categoryService.canDeleteCategory(deletingCategory.id);
      
      if (!canDelete) {
        toast({
          title: "Não é possível remover",
          description: "Esta categoria possui tickets associados e não pode ser removida.",
          variant: "destructive",
        });
        return;
      }

      deactivateCategory(deletingCategory.id);
      setDeletingCategory(null);
    } catch (error) {
      toast({
        title: "Erro ao verificar categoria",
        description: "Não foi possível verificar se a categoria pode ser removida.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                Gerencie as categorias de tickets da sua empresa
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{category.name}</h3>
                      {category.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Padrão
                        </Badge>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Chave: {category.key}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!category.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-8">
                <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira categoria para organizar os tickets.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Categoria
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSave={editingCategory ? handleUpdateCategory : handleCreateCategory}
        category={editingCategory}
      />

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a categoria "{deletingCategory?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryManagement;
