import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Candidate } from '@/api'; // Update the import path as needed
import { useWorkspace } from '@/context/useWorkspace';

interface AddCandidateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (candidate: Omit<Candidate, '_id'>) => void;
}

const AddCandidate: React.FC<AddCandidateProps> = ({ open, onOpenChange, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [position, setPosition] = useState('');
  const { currentWorkspace } = useWorkspace();
  
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
    if (currentWorkspace) {
      onSubmit({ name, email, position, workspaceId: currentWorkspace._id, interview_status: status }); // workspace will be set in the parent component
    }
    // Reset form fields
    setName('');
    setEmail('');
    setStatus('');
    setPosition('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
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
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical Round 1">Technical Round 1</SelectItem>
                <SelectItem value="Technical Round 2">Technical Round 2</SelectItem>
                <SelectItem value="Culture Fit">Culture Fit</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="position"
              placeholder='Position'
              className="w-full"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button className='w-full' type="submit">Add Candidate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidate;