import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { Dashboard, Home, Pricing, Settings, Login, Register, Workspace, About, Contact, Support, WorkspaceSettings } from '@/pages';
import { ChatInterface, Compliance, Configure, DashboardIndex, Email, Feedback, Integration, Meetings, Onboarding, Policies, Team } from '@/components';
import { AuthProvider, useAuth } from '@/context/useAuth';
import { UserProvider, useUser } from '@/context/useUser';
import { WorkspaceProvider, useWorkspace } from '@/context/useWorkspace';
import PublicLayout from './pages/publicLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();

  // First, check if there's no session
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there's a session but no user data, they need to register
  if (session && !user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // If there's a session and user but no workspace, they need to create one
  if (session && user && !currentWorkspace) {
    return <Navigate to="/create-workspace" state={{ from: location }} replace />;
  }

  // If all conditions are met, render the protected content
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode; withLayout?: boolean }> = ({ children, withLayout = true }) => {
  const { session } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  // Allow access to register page if there's a session but no user
  if (location.pathname === '/register' && session && !user) {
    return withLayout ? <PublicLayout>{children}</PublicLayout> : <>{children}</>;
  }

  // Redirect authenticated users with complete profiles to dashboard
  if (session && user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (withLayout) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  return <>{children}</>;
};


const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes with layout */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about-us" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        
        {/* Auth routes - without layout */}
        <Route path="/login" element={
          <PublicRoute withLayout={false}>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute withLayout={false}>
            <Register />
          </PublicRoute>
        } />
        <Route path="/create-workspace" element={<Workspace />} />
        
        {/* Protected routes */}
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
          <Route path="workspace-settings" element={<WorkspaceSettings />} />
        </Route>
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
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