import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SecureCspHeaders } from "@/components/security/SecureCspHeaders";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <SecureCspHeaders />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
