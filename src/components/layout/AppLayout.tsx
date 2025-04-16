
import { Outlet } from "react-router-dom";
import { NavMenu } from "./NavMenu";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavMenu />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
