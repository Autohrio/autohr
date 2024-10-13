import React, { useState} from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AddCandidate from './addCandidate/addCandidate';

interface Candidate {
  name: string;
  email: string;
  status: string;
  avatarUrl?: string;
  position: string;
}

const CandidateItem: React.FC<Candidate> = ({ name, email, status, avatarUrl, position }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={name} />
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
      <Select defaultValue={status}>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

const Onboarding: React.FC = () => {
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

  const candidates: Candidate[] = [
    { name: "Alice Johnson", email: "alice@example.com", status: "Technical Round 1", position: "Frontend Developer" },
    { name: "Bob Smith", email: "bob@example.com", status: "Culture Fit", position: "DevOps Engineer" },
    { name: "Charlie Brown", email: "charlie@example.com", status: "Accepted", position: "Backend Developer" },
    { name: "Diana Prince", email: "diana@example.com", status: "Technical Round 2", position: "Full Stack Developer" },
    { name: "Ethan Hunt", email: "ethan@example.com", status: "Accepted", position: "Product Manager" },
  ];

  const ongoingCandidates = candidates.filter(c => c.status !== "Accepted");
  const acceptedCandidates = candidates.filter(c => c.status === "Accepted");

  return (
    <div className="container mx-auto p-6">
      <AddCandidate open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <Button onClick={() => setIsAddCandidateOpen(true)}>Add Candidate</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Candidates in the hiring process</CardTitle>
        </CardHeader>
        <CardContent>
          {ongoingCandidates.map((candidate, index) => (
            <CandidateItem key={index} {...candidate} />
          ))}
          {acceptedCandidates.length > 0 && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold mb-2">Accepted Candidates</h3>
              {acceptedCandidates.map((candidate, index) => (
                <CandidateItem key={index} {...candidate} />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;