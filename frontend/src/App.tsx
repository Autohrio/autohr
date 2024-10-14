// App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { Dashboard, Home, Login, Pricing, Settings } from '@/pages';
import { ChatInterface, Compliance, Configure, DashboardIndex, Meetings, Onboarding, Policies, Team } from '@/components';
import { AuthProvider, useAuth } from '@/context/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardIndex />} />
        <Route path="team" element={<Team />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="policies" element={<Policies />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="ai-chat" element={<ChatInterface />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="configure" element={<Configure />} />
      </Route>
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;