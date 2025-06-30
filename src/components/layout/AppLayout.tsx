
import { Sidebar } from "./Sidebar";
import { HeaderManager } from "./HeaderManager";
import { Toaster } from "@/components/ui/toaster";
import '@/styles/app.css';

interface AppLayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

export function AppLayout({ children, fullScreen = false }: AppLayoutProps) {
  return (
    <div 
      id="app-container"
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <HeaderManager />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 lg:ml-64 ${fullScreen ? 'h-[calc(100vh-3.5rem)]' : 'pt-4'} overflow-hidden`}>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
