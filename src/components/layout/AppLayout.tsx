
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from "react-router-dom";
import '@/styles/app.css';

interface AppLayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

export function AppLayout({ children, fullScreen }: AppLayoutProps) {
  const location = useLocation();
  
  // Auto-detect fullScreen mode for workspace
  const isWorkspacePage = location.pathname === '/workspace';
  const shouldUseFullScreen = fullScreen || isWorkspacePage;

  return (
    <div 
      id="app-container"
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={`flex-1 lg:ml-64 ${shouldUseFullScreen ? 'h-[calc(100vh-3.5rem)] overflow-hidden' : 'pt-4'}`}>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
