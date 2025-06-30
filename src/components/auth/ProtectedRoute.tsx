
import React from 'react';
import { RequireAuth } from './RequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  return (
    <RequireAuth allowedRoles={allowedRoles}>
      <AppLayout>
        {children}
      </AppLayout>
    </RequireAuth>
  );
};
