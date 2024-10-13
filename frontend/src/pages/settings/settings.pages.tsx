import React, { useState } from 'react';
import ProfileSection from './profileSection/profileSection';
import Account from './account/account';
import { DashboardHeader } from '@/components';

type Section = 'Profile' | 'Account' | 'Appearance' | 'Billing';

interface SettingsSidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, setActiveSection }) => {
  const sections: Section[] = ['Profile', 'Account', 'Appearance', 'Billing'];
  
  return (
    <div className="min-h-screen w-64 bg-gray-100 p-4 rounded-xl">
      {sections.map((section) => (
        <div
          key={section}
          className={`p-2 cursor-pointer ${activeSection === section ? 'bg-gray-200 font-semibold rounded-sm' : ''}`}
          onClick={() => setActiveSection(section)}
        >
          {section}
        </div>
      ))}
    </div>
  );
};



const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('Account');

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className='p-6'>
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">Manage your account settings and set e-mail preferences.</p>
        </div>
        
        <div className="flex">
          <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <div className="flex-grow ml-8">
            {activeSection === 'Profile' && <ProfileSection />}
            {activeSection === 'Account' && <Account />}

            {/* Add other sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;