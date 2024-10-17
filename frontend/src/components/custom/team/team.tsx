import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import AddMember from './addMember/addMember';
import { getTeamMembersByWorkspace, TeamMember as TeamMemberType } from '@/api';
import { useWorkspace } from '@/context/useWorkspace';

interface TeamMemberProps {
  member: TeamMemberType;
  onRoleChange: (memberId: string, newRole: string) => void;
}

export interface WorkspaceStateDTO {
  _id: string;
  name: string;
  owner_email: string;
  teams: string[];
  onboardings: string[];
  policies: string[];
  compliances: string[];
  meetings: string[];
  emails: string[];
  apiKeys: string[];
  employeeFeedbacks: string[];
  companyFeedbacks: string[];
  __v: number;
}


const TeamMember: React.FC<TeamMemberProps> = ({ member, onRoleChange }) => {
  const { _id, name, email, role, occupation, teams } = member;

  const handleRoleChange = (newRole: string) => {
    onRoleChange(_id, newRole);
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
            <DropdownMenuItem>Remove from organization</DropdownMenuItem>
            <DropdownMenuItem className='text-red-600'>Leave organization</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentWorkspace } = useWorkspace();
  const [teamId, setTeamId] = useState<string>("");

  useEffect(() => {
    const fetchTeamMembers = async (workspaceId: string) => {
      try {
        const members = await getTeamMembersByWorkspace(workspaceId);
        setTeamMembers(members);
        setIsLoading(false);
      } catch (err) {
        setError(`Failed to fetch team members: ${err}`);
        setIsLoading(false);
      }
    };

    if (currentWorkspace && currentWorkspace) {
      fetchTeamMembers(currentWorkspace._id);
      setTeamId(currentWorkspace.teams[0])
    } else {
      setIsLoading(false);
      setError('No workspace selected');
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


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
          {teamMembers.map((member) => (
            <TeamMember
              key={member._id}
              member={member}
              onRoleChange={handleRoleChange}
            />
          ))}
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