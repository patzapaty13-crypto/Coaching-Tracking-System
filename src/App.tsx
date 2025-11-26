import { useState, useEffect } from 'react';
import { User } from './types';
import { StudentDashboard } from './components/StudentDashboard';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { SecureLoginPage } from './components/SecureLoginPage';
import { getCurrentUserFromStorage, clearUser } from './services/authService';
import { clearTokens } from './utils/auth';
import { logAuditEvent } from './utils/audit';
import { mockUsers } from './data/mockData';

type AppView = 'role-selection' | 'login' | 'dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('role-selection');
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

  const handleRoleSelect = (role: string) => {
    // Find first user with this role
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setSelectedRole(role);
      setCurrentView('login');
    }
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
    setCurrentView('role-selection');
    setSelectedRole('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    case 'role-selection':
      return <RoleSelectionPage onRoleSelect={handleRoleSelect} />;
    case 'login':
      return <SecureLoginPage onLogin={handleLogin} onBack={handleBackToRoleSelection} selectedRole={selectedRole} />;
    default:
      return <RoleSelectionPage onRoleSelect={handleRoleSelect} />;
  }
}
