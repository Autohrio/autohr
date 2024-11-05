import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from 'lucide-react';
// import { createCompanyFeedback } from '@/api/feedback';
import { useWorkspace } from '@/context/useWorkspace';
import { useUser } from '@/context/useUser';
import { createCompanyFeedback } from '@/api/feedback';

const feedbackTypes = [
  { id: 'software', title: 'Software Feedback', description: 'Feedback about the software' },
  { id: 'employee', title: 'Employee Feedback', description: 'Feedback for a specific employee' },
  { id: 'company', title: 'Company Feedback', description: 'How do you feel about the company?' },
  { id: 'candidate', title: 'Candidate Feedback', description: 'How do you feel about the interview process and experience?' },
];

const employees = [
  { id: '1', name: 'John Doe', avatar: '/john-doe.jpg', occupation: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', avatar: '/jane-smith.jpg', occupation: 'Product Manager' },
  { id: '3', name: 'Bob Johnson', avatar: '/bob-johnson.jpg', occupation: 'UX Designer' },
  { id: '4', name: 'Alice Williams', avatar: '/alice-williams.jpg', occupation: 'Data Analyst' },
];

const candidates = [
  { id: '1', name: 'Emma Brown', avatar: '/emma-brown.jpg', position: 'Frontend Developer' },
  { id: '2', name: 'Michael Lee', avatar: '/michael-lee.jpg', position: 'Backend Engineer' },
  { id: '3', name: 'Sarah Davis', avatar: '/sarah-davis.jpg', position: 'Data Scientist' },
  { id: '4', name: 'David Wilson', avatar: '/david-wilson.jpg', position: 'Product Manager' },
];

const Feedback: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const { user } = useUser();

  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleFeedbackSubmit = async () => {
    if (!activeFeedback || !feedbackText) {
      return;
    }

    if (!currentWorkspace?._id || !user?._id) {
      setSubmissionStatus('error');
      setDialogOpen(true);
      return;
    }

    if (activeFeedback === 'employee' && !selectedEmployee) {
      alert('Please select an employee for feedback.');
      return;
    }

    if (activeFeedback === 'candidate' && !selectedCandidate) {
      alert('Please select a candidate for feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeFeedback === 'company') {
        const feedbackResponse = await createCompanyFeedback(currentWorkspace._id, user._id, feedbackText);
        if (feedbackResponse.created_at) {
          setSubmissionStatus('success');
        } else {
          setSubmissionStatus('error');
        }
        // Reset form after successful submission
        setFeedbackText('');
        setActiveFeedback(null);
        setSelectedEmployee('');
        setSelectedCandidate('');
      }
      // Add other feedback type handlers here when needed
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (submissionStatus === 'success') {
      setFeedbackText('');
      setSelectedEmployee('');
      setSelectedCandidate('');
      setSubmissionStatus(null);
    }
  };

  // If there's no workspace or user, show an error
  if (!currentWorkspace || !user) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load workspace or user information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Provide Feedback</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {feedbackTypes.map((type) => (
          <Card
            key={type.id}
            className={`border-gray-700 cursor-pointer transition-colors ${activeFeedback === type.id ? 'bg-gray-100 border-gray-400 border-2' : 'hover:bg-gray-100'
              }`}
            onClick={() => setActiveFeedback(type.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{type.title}</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeFeedback && (
        <div className="space-y-4">
          {activeFeedback === 'employee' && (
            <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
              <SelectTrigger className="w-full h-15 text-left">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.occupation}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {activeFeedback === 'candidate' && (
            <Select onValueChange={setSelectedCandidate} value={selectedCandidate}>
              <SelectTrigger className="w-full h-15 text-left">
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-gray-500">{candidate.position}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Textarea
            placeholder="Type your feedback here..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full h-32 border-gray-700"
          />
          <Button
            onClick={handleFeedbackSubmit}
            className="bg-slate-900 hover:bg-blue-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      )}

<Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {submissionStatus === 'success' ? 'Success!' : 'Error'}
            </DialogTitle>
          </DialogHeader>
          
          {/* Move Alert outside of DialogDescription */}
          <div className="mt-4">
            {submissionStatus === 'success' ? (
              <div className="text-green-700 space-y-2">
                <div className="font-medium text-lg">Feedback Submitted</div>
                <div className="text-sm">
                  Your feedback has been successfully submitted. Thank you for your input!
                </div>
              </div>
            ) : (
              <div className="text-red-700 space-y-2">
                <div className="font-medium text-lg">Submission Failed</div>
                <div className="text-sm">
                  There was an error submitting your feedback. Please try again later.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedback;