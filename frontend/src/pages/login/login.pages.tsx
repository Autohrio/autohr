import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LOGO } from '@/assets';
import { useAuth } from '@/context/useAuth';
import { useUser } from '@/context/useUser';
import { useWorkspace } from '@/context/useWorkspace';
import { registerUser, getAllWorkspaces, createWorkspace, checkUserEmailAlreadyExists } from '@/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'register' | 'workspace'>('email');
  const [message, setMessage] = useState('');
  const { session, signInWithOtp, verifyOtp } = useAuth();
  const { loadUser } = useUser();
  const { setCurrentWorkspace, setWorkspaces } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithOtp(email);
      setStep('otp');
      setMessage('Email has been sent to your inbox. Please check your email or spam folder.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send email. Please try again.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      if (session?.user.aud === 'authenticated') {
        const userData = await checkUserEmailAlreadyExists(email);
        if (userData) {
          // User exists, load workspaces
          await loadUser(email);
          const userWorkspaces = await getAllWorkspaces(email);
          setWorkspaces(userWorkspaces);
          if (userWorkspaces.length > 0) {
            setCurrentWorkspace(userWorkspaces[0]);
            navigate(from, { replace: true });
          } else {
            setStep('workspace');
            setMessage('Please create your first workspace.');
          }
        } else {
          // User doesn't exist, move to registration
          setStep('register');
          setMessage('Please provide your name and username to complete registration.');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(name, email, username);
      await loadUser(email);
      setStep('workspace');
      setMessage('Registration successful. Please create your first workspace.');
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWorkspace = await createWorkspace(workspaceName, email);
      setWorkspaces([newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error creating workspace:', error);
      setMessage('Workspace creation failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Dark section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-pink-200 via-orange-200 to-orange-200 p-12 flex-col justify-between">
        <div>
          <h2 className="text-4xl font-bold">Auto<span className='text-orange-400'>Hr</span>.</h2>
        </div>
        <div>
          <img className='h-40' src={LOGO} alt="" />
          <p className="text-lg italic">
            "AutoHr: Your Intelligent HR Management"
          </p>
        </div>
      </div>
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {step === 'register' ? 'Complete Your Registration' :
                step === 'workspace' ? 'Create Your Workspace' :
                  'Create an account or sign in'}
            </CardTitle>
            <CardDescription>
              {step === 'register' ? 'Please provide your details to complete registration' :
                step === 'workspace' ? 'Enter a name for your new workspace' :
                  'Enter your email below to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4" variant={step === 'otp' ? "default" : "destructive"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={step === 'email' ? handleSendOtp :
              step === 'otp' ? handleVerifyOtp :
                step === 'register' ? handleRegister :
                  handleCreateWorkspace}>
              {step === 'email' && (
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              {step === 'otp' && (
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}
              {step === 'register' && (
                <>
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {step === 'workspace' && (
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Workspace Name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                  />
                </div>
              )}
              <Button className="w-full" variant="default" type="submit">
                {step === 'email' ? 'Sign In with Email' :
                  step === 'otp' ? 'Verify OTP' :
                    step === 'register' ? 'Complete Registration' :
                      'Create Workspace'}
              </Button>
            </form>
          </CardContent>
          <div className="text-xs text-center px-4 py-4 text-gray-500">
            By clicking continue, you agree to our{' '}
            <a href="/" className="underline">Terms of Service</a> and{' '}
            <a href="/" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;