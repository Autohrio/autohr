import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import AddMember from './addMember/addMember';

interface TeamMember {
  name: string;
  email: string;
  role: 'Owner' | 'Member';
  avatarUrl?: string;
  occupation?: string;
}

const TeamMember: React.FC<TeamMember> = ({ name, email, role, avatarUrl, occupation }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {name} {occupation ? <><span className="text-gray-500">•</span> <span className="text-sm bg-gray-600 px-2 rounded-xl text-white">{occupation}</span></> : <></>}
        </p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Select defaultValue={role}>
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Owner">Owner</SelectItem>
          <SelectItem value="Member">Member</SelectItem>
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

const Team: React.FC = () => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const teamMembers: TeamMember[] = [
    { name: "Sofia Davis", email: "m@autohr.dev", role: "Owner", occupation: "CEO" },
    { name: "Jackson Lee", email: "p@autohr.dev", role: "Member", occupation: "Full Stack Developer" },
    { name: "Emma Wilson", email: "e.wilson@autohr.dev", role: "Member", occupation: "DevOps Engineer" },
    { name: "Liam Chen", email: "l.chen@autohr.dev", role: "Member", occupation: "CTO" },
  ];

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
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </CardContent>
      </Card>
      <AddMember open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} />
    </div>
  );
};

export default Team;