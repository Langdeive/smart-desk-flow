
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RequireAuth = ({ children, allowedRoles = [] }: RequireAuthProps) => {
  const { user, emailVerified, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Verifica se o usuário está autenticado
  if (!user) {
    toast.error('Acesso negado', {
      description: 'Você precisa estar logado para acessar esta página'
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o e-mail foi verificado
  if (!emailVerified) {
    toast.error('Email não verificado', {
      description: 'Por favor, verifique seu email antes de continuar'
    });
    return <Navigate to="/login" state={{ from: location, needVerification: true }} replace />;
  }

  // Verifica se o usuário tem as permissões necessárias
  if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    toast.error('Acesso negado', {
      description: 'Você não tem permissão para acessar esta página'
    });
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
