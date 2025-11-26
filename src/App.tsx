import { useState, useEffect } from 'react';
import { User } from './types';
import { StudentDashboard } from './components/StudentDashboard';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { SecureLoginPage } from './components/SecureLoginPage';
import { getCurrentUserFromStorage, clearUser } from './services/authService';
import { clearTokens } from './utils/auth';
import { logAuditEvent } from './utils/audit';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = getCurrentUserFromStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditEvent(currentUser.id, currentUser.role, 'logout', { success: true });
    }
    clearUser();
    clearTokens();
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <SecureLoginPage onLogin={handleLogin} />;
  }

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
