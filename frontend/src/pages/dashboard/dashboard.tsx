// dashboardLayout.tsx

import { DashboardHeader, Sidebar } from "@/components";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {  useWorkspace } from '@/context/useWorkspace';
import { getAllWorkspaces } from "@/api";
import { useUser } from "@/context/useUser";
export default function DashboardLayout() {
  const { user } = useUser();
  const { setWorkspaces, setCurrentWorkspace, currentWorkspace } = useWorkspace();
  const getWorkspaces = async () => {
    if (user) {
      try {
        const userWorkspaces = await getAllWorkspaces(user.email);
        setWorkspaces(userWorkspaces);
        if (userWorkspaces.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(userWorkspaces[0]);
        }
      } catch (error) {
        console.error('Error loading workspaces:', error);
      }
    }
  }

  useEffect(() => {
    getWorkspaces()
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r p-4 bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}