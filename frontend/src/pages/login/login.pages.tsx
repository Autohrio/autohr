import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/useAuth';
import { checkUserEmailAlreadyExists } from '@/api';
import { LOGO } from '@/assets';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [message, setMessage] = useState('');
  const { signInWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

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
      const userData = await checkUserEmailAlreadyExists(email);
      if (userData) {
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Invalid OTP. Please try again.');
    }
  };

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
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create an account or sign in</CardTitle>
            <CardDescription>Enter your email below to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4" variant={step === 'otp' ? "default" : "destructive"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}>
              <div className="mb-4">
                <Input
                  type={step === 'email' ? "email" : "text"}
                  placeholder={step === 'email' ? "name@example.com" : "Enter OTP"}
                  value={step === 'email' ? email : otp}
                  onChange={(e) => step === 'email' ? setEmail(e.target.value) : setOtp(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800" type="submit">
                {step === 'email' ? 'Sign In with Email' : 'Verify OTP'}
              </Button>
            </form>
            <div className="text-xs text-center mt-4 text-gray-500">
              By clicking continue, you agree to our{' '}
              <a href="/" className="underline">Terms of Service</a> and{' '}
              <a href="/" className="underline">Privacy Policy</a>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;