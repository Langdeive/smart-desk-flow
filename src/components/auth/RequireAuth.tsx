
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o e-mail foi verificado
  if (!emailVerified) {
    return <Navigate to="/login" state={{ from: location, needVerification: true }} replace />;
  }

  // Verifica se o usuário tem as permissões necessárias
  if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};
