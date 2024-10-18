import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddCandidate from './addCandidate/addCandidate';
import CandidateItem from './candidateItem/candidateItem';
import { Candidate, getCandidatesByWorkspace, addCandidate, removeCandidate, patchCandidate } from '@/api';
import { useWorkspace } from '@/context/useWorkspace';

const Onboarding: React.FC = () => {
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentWorkspace } = useWorkspace();

  const fetchCandidates = useCallback(async (workspaceId: string) => {
    try {
      setIsLoading(true);
      const fetchedCandidates = await getCandidatesByWorkspace(workspaceId);
      setCandidates(fetchedCandidates);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentWorkspace?._id) {
      fetchCandidates(currentWorkspace._id);
    } else {
      setIsLoading(false);
      setError('No workspace selected');
    }
  }, [currentWorkspace, fetchCandidates]);

  const handleAddCandidate = async (newCandidate: Omit<Candidate, '_id'>) => {
    try {
      if (currentWorkspace?._id) {
        const addedCandidate = await addCandidate({ ...newCandidate, workspaceId: currentWorkspace._id });
        setCandidates(prev => [...prev, addedCandidate]);
        setIsAddCandidateOpen(false);
      }
    } catch (err) {
      setError('Failed to add candidate');
      console.error(err);
    }
  };

  const handleRemoveCandidate = async (candidateId: string) => {
    try {
      if (currentWorkspace?._id) {
        await removeCandidate(currentWorkspace._id, candidateId);
        setCandidates(prev => prev.filter(candidate => candidate._id !== candidateId));
      }
    } catch (err) {
      setError('Failed to remove candidate');
      console.error(err);
    }
  };

  const handleUpdateCandidate = async (candidateId: string, updateData: Partial<Candidate>) => {
    try {
      if (currentWorkspace?._id) {
        const updatedCandidate = await patchCandidate(currentWorkspace._id, candidateId, updateData);
        setCandidates(prev => prev.map(candidate => 
          candidate._id === candidateId ? { ...candidate, ...updatedCandidate } : candidate
        ));
      }
    } catch (err) {
      setError('Failed to update candidate');
      console.error(err);
    }
  };

  const ongoingCandidates = candidates.filter(c => c.interview_status !== "Accepted");
  const acceptedCandidates = candidates.filter(c => c.interview_status === "Accepted");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <AddCandidate 
        open={isAddCandidateOpen} 
        onOpenChange={setIsAddCandidateOpen}
        onSubmit={handleAddCandidate}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Onboarding</h1>
        <Button onClick={() => setIsAddCandidateOpen(true)}>Add Candidate</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Candidates in the hiring process</CardTitle>
        </CardHeader>
        <CardContent>
          {ongoingCandidates.map((candidate) => (
            <CandidateItem 
            key={candidate._id} {...candidate} 
            onRemove={handleRemoveCandidate} 
            onUpdate={handleUpdateCandidate}
            />
          ))}
          {acceptedCandidates.length > 0 && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold mb-2">Accepted Candidates</h3>
              {acceptedCandidates.map((candidate) => (
                <CandidateItem 
                key={candidate._id} {...candidate} 
                onRemove={handleRemoveCandidate} 
                onUpdate={handleUpdateCandidate}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;