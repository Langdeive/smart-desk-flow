
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavMenu } from "./NavMenu";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavMenu />
      
      <div className="flex flex-1">
        {/* Mobile sidebar toggle */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-40 lg:hidden"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Sidebar - hidden on mobile unless toggled */}
        {showSidebar && (
          <div className="lg:hidden">
            <Sidebar />
          </div>
        )}
        
        {/* Sidebar - always visible on larger screens */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
