
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "@/components/ui/toaster";
import '@/styles/app.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div 
      id="app-container"
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-4">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
