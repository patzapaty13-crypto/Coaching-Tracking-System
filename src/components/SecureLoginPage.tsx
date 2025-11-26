import { useState } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/security';
import { login, storeUser } from '../services/authService';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ChevronLeft, Phone, UserPlus } from 'lucide-react';

interface SecureLoginPageProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
  selectedRole?: string;
}

export function SecureLoginPage({ onLogin, onBack, selectedRole }: SecureLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setIsTransitioning(true);

    if (!email || !validateEmail(email)) {
      setErrors({ email: 'กรุณากรอกอีเมลที่ถูกต้อง' });
      setIsLoading(false);
      setIsTransitioning(false);
      return;
    }

    if (!password) {
      setErrors({ password: 'กรุณากรอกรหัสผ่าน' });
      setIsLoading(false);
      setIsTransitioning(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success && result.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        storeUser(result.user);
        onLogin(result.user);
      } else {
        setErrors({ general: result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        setIsLoading(false);
        setIsTransitioning(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setErrors({ general: errorMessage });
      setIsLoading(false);
      setIsTransitioning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDI3NTc7c3RvcC1vcGFjaXR5OjAuOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMGE0YTtzdG9wLW9wYWNpdHk6MC44Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-transparent"></div>
      
      {/* Decorative Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Top Contact Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm text-white/90">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>โทร: (02) 579-1111</span>
              </div>
              <span>|</span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>อีเมล: coaching@spu.ac.th</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Branding */}
          <div className="hidden lg:block">
            <div className="mb-8">
              <div className="text-6xl font-bold text-white mb-2 tracking-tight">SPU</div>
              <div className="text-xl text-white/90 font-light mb-8">SRIPATUM UNIVERSITY</div>
            </div>
            <div>
              <p className="text-2xl text-white/90 mb-4">ยินดีต้อนรับ</p>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                Coaching
                <br />
                <span className="text-pink-400">Platform</span>
              </h1>
              <p className="text-xl text-white/80 font-light">
                SPU Coaching & Project-based Learning Management System
              </p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className={`bg-white rounded-2xl shadow-2xl p-8 border-l-4 border-pink-500 transform transition-all duration-500 ${
              isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}>
              {/* Back Button */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">กลับไปเลือกบทบาท</span>
                </button>
              )}

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
                <p className="text-sm text-gray-600">
                  กรุณาเลือกบทบาทและกรอกข้อมูลเพื่อเข้าสู่ระบบ
                </p>
                {selectedRole && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                    <span>บทบาท: {selectedRole === 'student' ? 'นักศึกษา' : selectedRole === 'advisor' ? 'อาจารย์ที่ปรึกษา' : selectedRole === 'admin' ? 'ผู้บริหาร' : 'กรรมการภายนอก'}</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{errors.general}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    อีเมลมหาวิทยาลัย (@spu.ac.th) *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors duration-200 ${
                        errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pink-500'
                      }`} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 ${
                        errors.email 
                          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 hover:border-gray-400'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="your.email@spu.ac.th"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    รหัสผ่าน *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${
                        errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-pink-500'
                      }`} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 ${
                        errors.password 
                          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 hover:border-gray-400'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-pink-500 disabled:opacity-50"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !!errors.email || !email || !password}
                  className="w-full bg-pink-500 text-white py-3.5 rounded-xl font-semibold hover:bg-pink-600 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform relative overflow-hidden"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    <span className="relative z-10">เข้าสู่ระบบ</span>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-pink-600 animate-pulse"></div>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-white border-2 border-pink-500 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>+ ลงทะเบียน</span>
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-700">การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS</p>
                    <p className="text-gray-500 mt-0.5">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>© 2025 Sripatum University. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
        .fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
