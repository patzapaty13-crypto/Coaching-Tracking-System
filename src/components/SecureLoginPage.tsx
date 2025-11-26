import { useState } from 'react';
import { User } from '../types';
import { login, storeUser } from '../services/authService';
import { mockUsers } from '../data/mockData';
import { Lock, GraduationCap, Users, Shield, Briefcase } from 'lucide-react';

interface SecureLoginPageProps {
  onLogin: (user: User) => void;
}

// Demo passwords
const DEMO_PASSWORDS: Record<string, string> = {
  'somchai@student.spu.ac.th': 'Student123!@#',
  'somying@student.spu.ac.th': 'Student123!@#',
  'prayuth@student.spu.ac.th': 'Student123!@#',
  'wichai@spu.ac.th': 'Advisor123!@#',
  'suda@spu.ac.th': 'Advisor123!@#',
  'admin@spu.ac.th': 'Admin123!@#',
  'external@company.com': 'Committee123!@#',
};

const roleIcons = {
  student: GraduationCap,
  advisor: Users,
  admin: Shield,
  committee: Briefcase,
};

const roleColors = {
  student: 'bg-blue-500',
  advisor: 'bg-green-500',
  admin: 'bg-purple-500',
  committee: 'bg-orange-500',
};

// Generate avatar initials (Thai style)
function getInitials(name: string): string {
  // Extract Thai initials
  const parts = name.split(' ');
  if (parts.length >= 2) {
    // Get first character of first two words
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // If only one word, get first two characters
  return name.substring(0, 2).toUpperCase();
}

export function SecureLoginPage({ onLogin }: SecureLoginPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAccountClick = async (user: User) => {
    setIsLoading(user.id);
    
    try {
      const password = DEMO_PASSWORDS[user.email.toLowerCase()] || '';
      const result = await login(user.email, password);
      
      if (result.success && result.user) {
        storeUser(result.user);
        onLogin(result.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  // Group users by role
  const usersByRole = mockUsers.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  const roleLabels: Record<string, string> = {
    student: 'นักศึกษา',
    advisor: 'อาจารย์ที่ปรึกษา',
    admin: 'ผู้บริหาร',
    committee: 'กรรมการภายนอก',
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-lg text-gray-700 font-medium">SPU Coaching Platform</p>
            <p className="text-sm text-gray-600 mt-1">ระบบบริหารจัดการ Project-based Learning</p>
            <p className="text-sm text-gray-600 mt-2 font-medium">เลือกบัญชีเพื่อทดสอบ</p>
          </div>

          {/* Account Selection by Role */}
          <div className="space-y-6">
            {Object.entries(usersByRole).map(([role, users]) => {
              const Icon = roleIcons[role as keyof typeof roleIcons];
              const colorClass = roleColors[role as keyof typeof roleColors];

              return (
                <div key={role} className="space-y-3">
                  {/* Role Header */}
                  <div className="flex items-center gap-3 px-2 pb-2 border-b border-gray-200">
                    <div className={`${colorClass} w-10 h-10 rounded-lg flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-800">{roleLabels[role]}</span>
                  </div>

                  {/* User Accounts */}
                  <div className="space-y-2">
                    {users.map((user) => {
                      const isLoggingIn = isLoading === user.id;
                      
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAccountClick(user)}
                          disabled={isLoading !== null}
                          className="w-full text-left px-4 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className={`${colorClass} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
                              <span className="text-white font-semibold text-base">
                                {getInitials(user.name)}
                              </span>
                            </div>
                            
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-base truncate group-hover:text-blue-700">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-600 truncate mt-0.5">{user.email}</p>
                            </div>
                          </div>
                          
                          {/* Role Icon */}
                          <div className={`${colorClass} w-10 h-10 rounded-lg flex items-center justify-center ml-3 flex-shrink-0 shadow-sm`}>
                            {isLoggingIn ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Icon className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700">การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS</p>
                <p className="text-gray-500 mt-0.5">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
