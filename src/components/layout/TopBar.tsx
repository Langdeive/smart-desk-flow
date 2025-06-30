
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "./UserMenu";

export function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold text-gray-900">SolveFlow</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
