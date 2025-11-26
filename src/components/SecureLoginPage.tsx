import { useState } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/security';
import { login, storeUser } from '../services/authService';
import { Lock, Mail, Eye, EyeOff, AlertCircle, User as UserIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-lg text-gray-700 font-medium">SPU Coaching Platform</p>
            <p className="text-sm text-gray-600 mt-1">ระบบบริหารจัดการ Project-based Learning</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
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
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
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
                <p className="text-gray-500 mt-0.5">ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
