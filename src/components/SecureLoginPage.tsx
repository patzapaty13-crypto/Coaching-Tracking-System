import { useState } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/security';
import { login, storeUser } from '../services/authService';
import { mockUsers } from '../data/mockData';
import { Lock, Mail, Eye, EyeOff, AlertCircle, GraduationCap, Users, Shield, Briefcase, Sparkles } from 'lucide-react';

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

export function SecureLoginPage({ onLogin }: SecureLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'รูปแบบอีเมลไม่ถูกต้อง' }));
    } else {
      setErrors((prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
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

  const handleQuickSelect = (selectedUser: User) => {
    setEmail(selectedUser.email);
    setPassword(DEMO_PASSWORDS[selectedUser.email.toLowerCase()] || '');
    setShowQuickSelect(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!email || !validateEmail(email)) {
      setErrors({ email: 'กรุณากรอกอีเมลที่ถูกต้อง' });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrors({ password: 'กรุณากรอกรหัสผ่าน' });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success && result.user) {
        storeUser(result.user);
        onLogin(result.user);
      } else {
        setErrors({ general: result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="text-gray-600 font-medium">SPU Coaching Platform</p>
            <p className="text-sm text-gray-500 mt-1">ระบบบริหารจัดการ Project-based Learning</p>
          </div>

          {/* Quick Select Button */}
          <button
            type="button"
            onClick={() => setShowQuickSelect(!showQuickSelect)}
            className="w-full mb-6 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl text-blue-700 font-medium hover:from-blue-100 hover:to-purple-100 hover:border-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            <span>เลือกบัญชีเพื่อทดสอบ</span>
          </button>

          {/* Quick Select Cards */}
          {showQuickSelect && (
            <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
              {Object.entries(usersByRole).map(([role, users]) => {
                const Icon = roleIcons[role as keyof typeof roleIcons];
                const colorClass = roleColors[role as keyof typeof roleColors];
                const roleLabels: Record<string, string> = {
                  student: 'นักศึกษา',
                  advisor: 'อาจารย์ที่ปรึกษา',
                  admin: 'ผู้บริหาร',
                  committee: 'กรรมการภายนอก',
                };

                return (
                  <div key={role} className="space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      <div className={`${colorClass} w-6 h-6 rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{roleLabels[role]}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleQuickSelect(user)}
                          className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                            </div>
                            <div className={`${colorClass} w-8 h-8 rounded-lg flex items-center justify-center ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm flex-1">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                  placeholder="your.email@spu.ac.th"
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                  placeholder="••••••••••"
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
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!errors.email || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:from-gray-400 disabled:hover:to-gray-400 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700">การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS</p>
                <p className="text-gray-500">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
