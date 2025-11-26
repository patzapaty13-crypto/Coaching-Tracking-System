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
    
    // Clear password error when user types
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

    // Validate inputs
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">เข้าสู่ระบบ</h1>
            <p className="text-gray-600">SPU Coaching Platform</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@spu.ac.th"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded ${getPasswordStrengthColor()}`} />
                    <div className={`h-1 flex-1 rounded ${passwordStrength !== 'weak' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-xs text-gray-500">
                    ความแข็งแกร่ง: {
                      passwordStrength === 'weak' ? 'อ่อน' :
                      passwordStrength === 'medium' ? 'ปานกลาง' : 'แข็งแกร่ง'
                    }
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}

              {/* Demo Password Hint */}
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium mb-1">Demo Accounts:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-400">
                  <li>Student: somchai@student.spu.ac.th / Student123!@#</li>
                  <li>Advisor: wichai@spu.ac.th / Advisor123!@#</li>
                  <li>Admin: admin@spu.ac.th / Admin123!@#</li>
                  <li>Committee: external@company.com / Committee123!@#</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!errors.email || !email || !password}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 การเชื่อมต่อถูกเข้ารหัสด้วย HTTPS
              <br />
              ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

