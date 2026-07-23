import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function Layout() {
  return (
    <div
      data-theme="night"
      className="flex min-h-screen bg-base-100 text-base-content"
    >
      {/* Sidebar navigation */}
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
