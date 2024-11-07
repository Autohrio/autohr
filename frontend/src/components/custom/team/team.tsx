import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, UserPlus2, Users } from "lucide-react";
import AddMember from './addMember/addMember';
import { getTeamMembersByWorkspace, TeamMember as TeamMemberType, removeTeamMember } from '@/api';
import { useWorkspace } from '@/context/useWorkspace';

interface TeamMemberProps {
  member: TeamMemberType;
  onRoleChange: (memberId: string, newRole: string) => void;
  onRemove: (memberId: string) => void;
}

const TeamMember: React.FC<TeamMemberProps> = ({ member, onRoleChange, onRemove }) => {
  const { _id, name, email, role, occupation, teams } = member;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRoleChange = (newRole: string) => {
    onRoleChange(_id, newRole);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      onRemove(_id);
    } catch (error) {
      console.error('Failed to remove team member:', error);
    } finally {
      setIsRemoving(false);
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
            {name} {occupation && <><span className="text-gray-500">•</span> <span className="text-sm bg-gray-600 px-2 rounded-xl text-white">{occupation}</span></>}
          </p>
          <p className="text-sm text-gray-500">{email}</p>
          {teams && teams.length > 0 && (
            <p className="text-xs text-gray-400">Teams: {teams.map(team => team.name).join(', ')}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select defaultValue={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Request Feedback</DropdownMenuItem>
            <DropdownMenuItem>Add Feedback (anonymous)</DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                  Remove from organization
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will remove the member from the organization.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemove} disabled={isRemoving}>
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

const EmptyState = ({ onAddMember }: { onAddMember: () => void }) => (
  <div className="text-center py-12">
    <Users className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">No team members yet</h3>
    <p className="mt-2 text-sm text-gray-500">Get started by adding your first team member.</p>
    <Button onClick={onAddMember} className="mt-6" variant="outline">
      <UserPlus2 className="mr-2 h-4 w-4" />
      Add Team Member
    </Button>
  </div>
);

const Team: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentWorkspace } = useWorkspace();
  const [teamId, setTeamId] = useState<string>("");

  useEffect(() => {
    const fetchTeamMembers = async (workspaceId: string) => {
      try {
        const members = await getTeamMembersByWorkspace(workspaceId);
        setTeamMembers(members);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setTeamMembers([]);
        setIsLoading(false);
      }
    };

    if (currentWorkspace && currentWorkspace) {
      fetchTeamMembers(currentWorkspace._id);
      setTeamId(currentWorkspace.teams[0])
    } else {
      setIsLoading(false);
      setTeamMembers([]);
    }
  }, [currentWorkspace]);

  const handleRoleChange = (memberId: string, newRole: string) => {
    // TODO: Implement API call to update member role
    console.log(`Changing role for member ${memberId} to ${newRole}`);
    // Update local state
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member._id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const handleMemberAdded = (newMember: TeamMemberType) => {
    setTeamMembers(prevMembers => [...prevMembers, newMember]);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeTeamMember(teamId, memberId);
      setTeamMembers(prevMembers => prevMembers.filter(member => member._id !== memberId));
    } catch (error) {
      console.error('Failed to remove team member:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button onClick={() => setIsAddMemberOpen(true)}>Add Member</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invite your team members to collaborate.</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <EmptyState onAddMember={() => setIsAddMemberOpen(true)} />
          ) : (
            teamMembers.map((member) => (
              <TeamMember
                key={member._id}
                member={member}
                onRoleChange={handleRoleChange}
                onRemove={handleRemoveMember}
              />
            ))
          )}
        </CardContent>
      </Card>
      <AddMember
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        teamId={teamId}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};

export default Team;