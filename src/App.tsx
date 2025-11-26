import { useState, useEffect } from 'react';
import { User } from './types';
import { StudentDashboard } from './components/StudentDashboard';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { LandingPage } from './components/LandingPage';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { SecureLoginPage } from './components/SecureLoginPage';
import { getCurrentUserFromStorage, clearUser } from './services/authService';
import { clearTokens } from './utils/auth';
import { logAuditEvent } from './utils/audit';

type AppView = 'landing' | 'role-selection' | 'login' | 'dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = getCurrentUserFromStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
      setCurrentView('dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    setCurrentView('role-selection');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentView('login');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedRole('');
  };

  const handleBackToRoleSelection = () => {
    setCurrentView('role-selection');
    setSelectedRole('');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditEvent(currentUser.id, currentUser.role, 'logout', { success: true });
    }
    clearUser();
    clearTokens();
    setCurrentUser(null);
    setCurrentView('landing');
    setSelectedRole('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (currentUser && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {currentUser.role === 'student' && (
          <StudentDashboard user={currentUser} onLogout={handleLogout} />
        )}
        {currentUser.role === 'advisor' && (
          <AdvisorDashboard user={currentUser} onLogout={handleLogout} />
        )}
        {currentUser.role === 'admin' && (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        )}
        {currentUser.role === 'committee' && (
          <CommitteeDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
    );
  }

  // Show appropriate view based on currentView state
  switch (currentView) {
    case 'landing':
      return <LandingPage onGetStarted={handleGetStarted} />;
    case 'role-selection':
      return <RoleSelectionPage onRoleSelect={handleRoleSelect} onBack={handleBackToLanding} />;
    case 'login':
      return <SecureLoginPage onLogin={handleLogin} onBack={handleBackToRoleSelection} selectedRole={selectedRole} />;
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}
