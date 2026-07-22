import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div
      data-theme="night"
      className="min-h-screen bg-base-100 text-base-content"
    >
      {/* Sidebar comes in Task 5.5 */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
