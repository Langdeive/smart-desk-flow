
import { NavMenu } from "./NavMenu";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "@/components/ui/toaster";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        minHeight: '100vh'
      }}
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
