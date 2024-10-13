import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AddMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMember: React.FC<AddMemberProps> = ({ open, onOpenChange }) => {
  const [name, setName] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    onOpenChange(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <Input 
              id="name" 
              placeholder='Name' 
              className="w-full" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input id="email" placeholder='Email' type="email" className="w-full" />
          </div>
          <DialogFooter>
            <Button className='w-full' type="submit">Send Invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;