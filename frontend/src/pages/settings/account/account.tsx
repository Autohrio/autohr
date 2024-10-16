import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUser } from '@/context/useUser';

const Account: React.FC = () => {
  const [date, setDate] = React.useState<Date>();
  const [name, setName] = React.useState<string | undefined>("");
  const { user } = useUser();

  useEffect(() => {
    setName(user?.name)
  }, [user])
  return (
    <div className="space-y-6 w-1/2">
      <div>
        <h2 className="text-2xl font-bold">Account</h2>
        <p className="text-gray-600">Update your account settings. Set your preferred language and timezone.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <Input id="name" placeholder="Your name" value={name}  className="mt-1" />
          <p className="mt-1 text-sm text-gray-500">This is the name that will be displayed on your profile and in emails.</p>
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of birth</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="mt-1 text-sm text-gray-500">Your date of birth is used to calculate your age.</p>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
          <Select>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-sm text-gray-500">This is the language that will be used in the dashboard.</p>
        </div>
      </div>

      <Button className="mt-6">Update account</Button>
      <Button className="mt-6 ml-2 bg-red-400">Delete account</Button>
    </div>
  );
};

export default Account;