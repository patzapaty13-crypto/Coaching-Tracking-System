import { useState } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/security';
import { login, storeUser } from '../services/authService';
import { mockUsers } from '../data/mockData';
import { Lock, User as UserIcon, Eye, EyeOff, AlertCircle, GraduationCap, Users, Shield, Briefcase, ChevronRight } from 'lucide-react';

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

// Generate avatar initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function SecureLoginPage({ onLogin }: SecureLoginPageProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountSelect, setShowAccountSelect] = useState(true);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    if (value) {
      setErrors((prev => {
        const newErrors = { ...prev };
        delete newErrors.username;
        return newErrors;
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value) {
      setErrors((prev => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      }));
    }
  };

  const handleAccountSelect = (user: User) => {
    setSelectedUser(user);
    setUsername(user.email);
    setPassword(DEMO_PASSWORDS[user.email.toLowerCase()] || '');
    setShowAccountSelect(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!username) {
      setErrors({ username: 'กรุณากรอกอีเมล' });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(username)) {
      setErrors({ username: 'รูปแบบอีเมลไม่ถูกต้อง' });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrors({ password: 'กรุณากรอกรหัสผ่าน' });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(username, password);
      
      if (result.success && result.user) {
        storeUser(result.user);
        onLogin(result.user);
      } else {
        setErrors({ general: result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
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

  // If showing account selection
  if (showAccountSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Blurred Cityscape Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwN2NjYztzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDQ0ODg7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PC9zdmc+')] bg-cover bg-center filter blur-3xl scale-150"></div>
        </div>

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
              <p className="text-gray-600 font-medium">SPU Coaching Platform</p>
              <p className="text-sm text-gray-500 mt-1">ระบบบริหารจัดการ Project-based Learning</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">เลือกบัญชีเพื่อทดสอบ</p>
            </div>

            {/* Account Selection by Role */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {Object.entries(usersByRole).map(([role, users]) => {
                const Icon = roleIcons[role as keyof typeof roleIcons];
                const colorClass = roleColors[role as keyof typeof roleColors];

                return (
                  <div key={role} className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      <div className={`${colorClass} w-8 h-8 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-base font-semibold text-gray-800">{roleLabels[role]}</span>
                    </div>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleAccountSelect(user)}
                          className="w-full text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white font-semibold text-sm">
                                {getInitials(user.name)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                            </div>
                          </div>
                          <div className={`${colorClass} w-8 h-8 rounded-lg flex items-center justify-center ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main login form
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blurred Cityscape Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwN2NjYztzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDQ0ODg7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PC9zdmc+')] bg-cover bg-center filter blur-3xl scale-150"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className={`${selectedUser ? roleColors[selectedUser.role as keyof typeof roleColors] : 'bg-gray-400'} w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white`}>
              {selectedUser ? (
                <span className="text-white font-bold text-2xl">
                  {getInitials(selectedUser.name)}
                </span>
              ) : (
                <UserIcon className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedUser ? selectedUser.name : 'Guest User'}
            </h2>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    errors.username 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                  }`}
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all ${
                    errors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                  }`}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-white hover:text-gray-200 transition-colors"
            >
              Forgot Username / Password?
            </button>
          </div>

          {/* Change Account Button */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setShowAccountSelect(true);
                setSelectedUser(null);
                setUsername('');
                setPassword('');
                setErrors({});
              }}
              className="text-sm text-white hover:text-gray-200 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              เลือกบัญชีอื่น
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 text-xs text-white/90">
              <Lock className="w-4 h-4" />
              <div className="text-center">
                <p className="font-medium">การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS</p>
                <p className="text-white/70 mt-0.5">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
