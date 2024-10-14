// Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthNavigation = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }

  return (
    <header className="bg-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold" onClick={() => navigate("/")}>Auto<span className='text-[#FF8D60]'>Hr.</span></div>
        <nav className="hidden md:flex space-x-4">
          <a href="/" className="hover:text-indigo-300">Coverage</a>
          <a href="/" className="hover:text-indigo-300">Resources</a>
          <a href="/" className="hover:text-indigo-300">Blog</a>
          <a href="/" className="hover:text-indigo-300">About</a>
          <a href="/pricing" className="hover:text-indigo-300">Pricing</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-primary"
            onClick={handleAuthNavigation}
          >
            {user ? 'Dashboard' : 'Sign Up / Sign In'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;