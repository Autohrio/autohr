
import { Button } from "@/components/ui/button";
import { ChevronDown, User, Mail, Home, Users, Globe, MessageCircle, Calendar, Settings, Cog } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">WORKSPACE</h2>
        <Button variant="ghost" className="w-full justify-between text-left">
          Aomni Demo
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">MAIN</h2>
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Accounts
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Contacts
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="mr-2 h-4 w-4" />
            Research
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageCircle className="mr-2 h-4 w-4" />
            AI Chat
          </Button>
        </nav>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">AUTOMATIONS</h2>
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Meetings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail className="mr-2 h-4 w-4" />
            Emails
          </Button>
        </nav>
      </div>
      <div>
        <h2 className="text-xs font-semibold text-gray-500 mb-2">SETTINGS</h2>
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Personalize
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Cog className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Globe className="mr-2 h-4 w-4" />
            Integrations
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar;