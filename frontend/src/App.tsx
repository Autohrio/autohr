// App.tsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Dashboard, Home, Settings } from './pages';
import { ChatInterface, Compliance, Configure, DashboardIndex, Meetings, Onboarding, Policies, Team } from './components';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardIndex />} />
          <Route path="team" element={<Team />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="policies" element={<Policies />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="ai-chat" element={<ChatInterface />} />
          <Route path="meetings" element={<Meetings />} />
          {/* <Route path="emails" element={<Emails />} /> */}
          {/* <Route path="personalize" element={<Personalize />} /> */}
          <Route path="configure" element={<Configure />} />
          {/* <Route path="integrations" element={<Integrations />} /> */}
        </Route>
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
