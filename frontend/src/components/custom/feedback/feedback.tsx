import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from 'lucide-react';

const feedbackTypes = [
  { id: 'software', title: 'Software Feedback', description: 'Feedback about the software' },
  { id: 'employee', title: 'Employee Feedback', description: 'Feedback for a specific employee' },
  { id: 'company', title: 'Company Feedback', description: 'How do you feel about the company?' },
  { id: 'candidate', title: 'Candidate Feedback', description: 'How do you feel about the interview process and experience?' },
];

// Mock list of employees with avatars and occupations
const employees = [
  { id: '1', name: 'John Doe', avatar: '/john-doe.jpg', occupation: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', avatar: '/jane-smith.jpg', occupation: 'Product Manager' },
  { id: '3', name: 'Bob Johnson', avatar: '/bob-johnson.jpg', occupation: 'UX Designer' },
  { id: '4', name: 'Alice Williams', avatar: '/alice-williams.jpg', occupation: 'Data Analyst' },
];

const Feedback: React.FC = () => {
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const handleFeedbackSubmit = () => {
    if (activeFeedback && feedbackText) {
      if (activeFeedback === 'employee' && !selectedEmployee) {
        alert('Please select an employee for feedback.');
        return;
      }
      console.log(`Submitting ${activeFeedback} feedback:`, feedbackText);
      if (activeFeedback === 'employee') {
        console.log('Selected employee:', selectedEmployee);
      }
      // Here you would typically send this data to your backend
      setFeedbackText('');
      setActiveFeedback(null);
      setSelectedEmployee('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Provide Feedback</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {feedbackTypes.map((type) => (
          <Card
            key={type.id}
            className={`border-gray-700 cursor-pointer transition-colors ${
              activeFeedback === type.id ? 'bg-gray-100 border-gray-400 border-2' : 'hover:bg-gray-100'
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
          <Textarea
            placeholder="Type your feedback here..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full h-32 border-gray-700"
          />
          <Button
            onClick={handleFeedbackSubmit}
            className="bg-slate-900 hover:bg-blue-600 text-white"
          >
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feedback;