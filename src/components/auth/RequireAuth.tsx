
import { PropsWithChildren } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps extends PropsWithChildren {
  allowedRoles?: string[];
  redirectTo?: string;
}

export function RequireAuth({ children, allowedRoles, redirectTo }: RequireAuthProps) {
  const { isAllowed } = useRequireAuth({ allowedRoles, redirectTo });

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
