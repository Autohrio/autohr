import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Mail, Home, Users, UserRoundCheck, Globe, MessageCircle, Calendar, Settings, Cog, PlusCircle } from "lucide-react";

const Sidebar = () => {
  const [activeWorkspace, setActiveWorkspace] = useState("Autohr Tech Team");

  const handleWorkspaceChange = (workspace: string) => {
    setActiveWorkspace(workspace);
    // You can add additional logic here, such as updating the UI or making API calls
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">WORKSPACE</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-left">
              {activeWorkspace}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => handleWorkspaceChange("Autohr Tech Team")}>
              Autohr Tech Team
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleWorkspaceChange("Autohr Management Team")}>
              Autohr Management Team
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">MAIN</h2>
        <nav className="space-y-1">
          <Link to="/dashboard" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link to="/dashboard/team" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Users className="mr-2 h-4 w-4" />
            Team
          </Link>
          <Link to="/dashboard/onboarding" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <UserRoundCheck className="mr-2 h-4 w-4" />
            Onboarding
          </Link>
          <Link to="/dashboard/policies" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <User className="mr-2 h-4 w-4" />
            Policies
          </Link>
          <Link to="/dashboard/compliance" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Globe className="mr-2 h-4 w-4" />
            Compliance
          </Link>
          <Link to="/dashboard/ai-chat" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <MessageCircle className="mr-2 h-4 w-4" />
            AI Chat
          </Link>
        </nav>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">AUTOMATIONS</h2>
        <nav className="space-y-1">
          <Link to="/dashboard/meetings" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Calendar className="mr-2 h-4 w-4" />
            Meetings
          </Link>
          {/* <Link to="/dashboard/emails" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Mail className="mr-2 h-4 w-4" />
            Emails
          </Link> */}
        </nav>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">SETTINGS</h2>
        <nav className="space-y-1">
          <Link to="/dashboard/feedback" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <MessageCircle className="mr-2 h-4 w-4" />
            Feedback
          </Link>
          <Link to="/dashboard/personalize" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Settings className="mr-2 h-4 w-4" />
            Personalize
          </Link>
          <Link to="/dashboard/configure" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Cog className="mr-2 h-4 w-4" />
            Configure
          </Link>
          <Link to="/dashboard/integrations" className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
            <Globe className="mr-2 h-4 w-4" />
            Integrations <span className="text-sm bg-gray-600 px-2 ml-2 rounded-xl text-white">beta</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar;