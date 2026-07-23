import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function Layout() {
  return (
    <div
      data-theme="night"
      className="flex min-h-screen bg-base-100 text-base-content"
    >
      {/* Sidebar comes in Task 5.5 */}
      <Sidebar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
