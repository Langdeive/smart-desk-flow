
import React from 'react';
import '@/styles/app.css';
import { Toaster } from "@/components/ui/sonner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div id="app-container" className="min-h-screen bg-white">
      <Toaster />
      <main className="flex flex-1 justify-center items-center p-4">
        {children}
      </main>
    </div>
  );
}
