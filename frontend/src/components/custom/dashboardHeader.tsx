import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, UserCircle, CreditCard, Settings, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/context/useAuth';
import { useUser } from "@/context/useUser";

export default function EmailClient() {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleDropdownNav = (route: string) => {
    navigate(`/${route}`)
  }

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div>Autohr.</div>
      <Input className="w-1/3" placeholder="Search" type="search" />
      <div className="flex items-center space-x-2">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-4 h-10">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="AK" />
                <AvatarFallback>{user?.name.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{user?.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-16 w-4" />
              <span>Profile</span>
              <span className="ml-auto text-xs text-gray-400">⌘P</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <span className="ml-auto text-xs text-gray-400">⌘B</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownNav('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <span className="ml-auto text-xs text-gray-400">⌘S</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <span className="ml-auto text-xs text-gray-400">⌘Q</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}