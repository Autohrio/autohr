// dashboardLayout.tsx
import { DashboardHeader, Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

export default function EmailClient() {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r p-4 bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1 flex">
          <Outlet />
        </main>
      </div>
    </div>
  )
}