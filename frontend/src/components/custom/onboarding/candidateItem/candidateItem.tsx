import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/api";

interface CandidateItemProps extends Candidate {
  onRemove: (id: string) => void;
  onUpdate: (id: string, updateData: Partial<Candidate>) => void;
}

const CandidateItem: React.FC<CandidateItemProps> = ({ name, email, interview_status, position, _id, onRemove, onUpdate }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveCandidate = async () => {
    if (!_id) return;
    setIsRemoving(true);
    try {
      if (_id){
         onRemove(_id);
      }
    } catch (error) {
      console.error('Failed to remove candidate:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (_id) {
      onUpdate(_id, { interview_status: newStatus });
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {name} <span className="text-gray-500">•</span> <span className="text-sm text-gray-500">{position}</span>
          </p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select defaultValue={interview_status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technical Round 1">Technical Round 1</SelectItem>
            <SelectItem value="Technical Round 2">Technical Round 2</SelectItem>
            <SelectItem value="Culture Fit">Culture Fit</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Send Rejection Email</DropdownMenuItem>
            <DropdownMenuItem>Send Offer Letter</DropdownMenuItem>
            <DropdownMenuItem>Send Compliances</DropdownMenuItem>
            <DropdownMenuItem>Send Company Policies</DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                  Remove Candidate
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the candidate from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveCandidate} disabled={isRemoving}>
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CandidateItem;