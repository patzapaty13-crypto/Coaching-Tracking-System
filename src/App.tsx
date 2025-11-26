import { useState } from 'react';
import { User } from './types';
import { StudentDashboard } from './components/StudentDashboard';
import { AdvisorDashboard } from './components/AdvisorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CommitteeDashboard } from './components/CommitteeDashboard';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
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
