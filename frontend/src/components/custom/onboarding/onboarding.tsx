import React, { useState} from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddCandidate from './addCandidate/addCandidate';
import CandidateItem from './candidateItem/candidateItem';

interface Candidate {
  name: string;
  email: string;
  status: string;
  avatarUrl?: string;
  position: string;
}


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