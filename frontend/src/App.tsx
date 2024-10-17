import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { Dashboard, Home, Pricing, Settings, Login, Register, Workspace } from '@/pages';
import { ChatInterface, Compliance, Configure, DashboardIndex, Email, Feedback, Integration, Meetings, Onboarding, Policies, Team } from '@/components';
import { AuthProvider, useAuth } from '@/context/useAuth';
import { UserProvider, useUser } from '@/context/useUser';
import { WorkspaceProvider, useWorkspace } from '@/context/useWorkspace';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  if (!currentWorkspace) {
    return <Navigate to="/create-workspace" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const location = useLocation();

  if (session) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/create-workspace" element={<Workspace />} />
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
        <Route path="emails" element={<Email />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="integrations" element={<Integration />} />
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
      <UserProvider>
        <WorkspaceProvider>
          <div className='App'>
            <AppRoutes />
          </div>
        </WorkspaceProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;