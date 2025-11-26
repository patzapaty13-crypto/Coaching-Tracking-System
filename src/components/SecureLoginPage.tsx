import { useState } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/security';
import { login, storeUser } from '../services/authService';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface SecureLoginPageProps {
  onLogin: (user: User) => void;
}

export function SecureLoginPage({ onLogin }: SecureLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
        setErrors({ general: result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">เข้าสู่ระบบ</h1>
            <p className="text-lg text-gray-700 font-semibold mb-1">SPU Coaching Platform</p>
            <p className="text-sm text-gray-500">ระบบบริหารจัดการ Project-based Learning</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2.5">
                อีเมล
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className={`w-5 h-5 transition-colors duration-200 ${
                    errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-600'
                  }`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 ${
                    errors.email 
                      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400'
                  }`}
                  placeholder="ur.email@spu.ac.th"
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
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2.5">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors duration-200 ${
                    errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-blue-600'
                  }`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 placeholder-gray-400 ${
                    errors.password 
                      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400'
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-blue-600"
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform"
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
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS</p>
                <p className="text-xs text-gray-500 mt-0.5">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
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
