import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addMemberToTeam, AddMemberData, TeamMember } from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onMemberAdded: (newMember: TeamMember) => void;
}

const AddMember: React.FC<AddMemberProps> = ({ open, onOpenChange, teamId, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [occupation, setOccupation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const memberData: AddMemberData = {
      name,
      email,
      role,
      occupation
    };

    try {
      const newMember = await addMemberToTeam(teamId, memberData);
      onMemberAdded(newMember);
      onOpenChange(false);
      // Reset form
      setName('');
      setEmail('');
      setRole('member');
      setOccupation('');
    } catch (error) {
      setError('Failed to add member. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              required
            />
            <Input 
              id="email" 
              placeholder='Email' 
              type="email" 
              className="w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              id="occupation" 
              placeholder='Occupation' 
              className="w-full" 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter>
            <Button className='w-full' type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;