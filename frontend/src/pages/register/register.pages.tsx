import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from '@/context/useUser';
import { useAuth } from '@/context/useAuth';
import { registerUser } from '@/api';
import { LOGO } from '@/assets';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const { loadUser } = useUser();
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !session.user || !session.user.email) {
      navigate('/login');
    }
  }, [session, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user || !session.user.email) {
      setMessage('No email found. Please log in again.');
      return;
    }
    try {
      await registerUser(name, session.user.email, username);
      await loadUser(session.user.email);
      navigate('/create-workspace');
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  if (!session || !session.user || !session.user.email) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Gradient section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-pink-200 via-orange-200 to-orange-200 p-12 flex-col justify-between">
        <div>
          <h2 className="text-4xl font-bold">Auto<span className='text-orange-400'>Hr</span>.</h2>
        </div>
        <div>
          <img className='h-40' src={LOGO} alt="AutoHr Logo" />
          <p className="text-lg italic">
            "AutoHr: Your Intelligent HR Management"
          </p>
        </div>
      </div>
      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
            <CardDescription>Please provide your details to complete registration</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegister}>
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
              <Button className="w-full bg-black text-white hover:bg-gray-800" type="submit">
                Complete Registration
              </Button>
            </form>
            <div className="text-xs text-center mt-4 text-gray-500">
              By clicking continue, you agree to our{' '}
              <a href="/" className="underline">Terms of Service</a> and{' '}
              <a href="/" className="underline">Privacy Policy</a>.
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Register;