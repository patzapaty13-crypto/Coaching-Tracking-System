import { useState } from 'react';
import { User } from '../types';
import { login, storeUser } from '../services/authService';
import { User as UserIcon, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface SecureLoginPageProps {
  onLogin: (user: User) => void;
  onBack?: () => void;
  selectedRole?: string;
}

export function SecureLoginPage({ onLogin }: SecureLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!username) {
      setErrors({ username: 'กรุณากรอก Username' });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrors({ password: 'กรุณากรอกรหัสผ่าน' });
      setIsLoading(false);
      return;
    }

    // Try to login with username as email
    try {
      const result = await login(username, password);
      
      if (result.success && result.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        storeUser(result.user);
        onLogin(result.user);
      } else {
        setErrors({ general: result.error || 'Username หรือ Password ไม่ถูกต้อง' });
        setIsLoading(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setErrors({ general: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Profile Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <UserIcon className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign In</h1>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{errors.general}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900 ${
                errors.username 
                  ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Username"
              autoComplete="username"
              required
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 placeholder-gray-400 bg-white text-gray-900 ${
                  errors.password 
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none disabled:opacity-50"
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
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังเข้าสู่ระบบ...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Remember Me & Forgot Password */}
        <div className="mt-4 flex items-center justify-between">
          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                rememberMe 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'bg-white border-gray-300 group-hover:border-blue-500'
              }`}>
                {rememberMe && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>
            </div>
            <span className="text-sm text-blue-600 font-medium">Remember Me</span>
          </label>

          {/* Forgot Password */}
          <button
            type="button"
            className="text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}
