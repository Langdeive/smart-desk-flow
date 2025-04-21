
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface UseRequireAuthOptions {
  allowedRoles?: string[];
  redirectTo?: string;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { allowedRoles = [], redirectTo = '/login' } = options;
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('Acesso negado', {
          description: 'Você precisa estar logado para acessar esta página'
        });
        navigate(redirectTo);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
        toast.error('Acesso negado', {
          description: 'Você não tem permissão para acessar esta página'
        });
        navigate('/403');
      }
    }
  }, [user, loading, role, allowedRoles, redirectTo, navigate]);

  return { isAllowed: !loading && !!user && (allowedRoles.length === 0 || allowedRoles.includes(role || '')) };
};
