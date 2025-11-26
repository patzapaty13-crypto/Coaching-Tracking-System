import { GraduationCap, Users, Shield, Briefcase, ArrowRight, ChevronLeft } from 'lucide-react';
import { User } from '../types';

interface RoleSelectionPageProps {
  onRoleSelect: (role: string) => void;
  onBack: () => void;
}

export function RoleSelectionPage({ onRoleSelect, onBack }: RoleSelectionPageProps) {
  const roleOptions = [
    {
      role: 'student',
      title: 'นักศึกษา',
      description: 'เข้าสู่ระบบสำหรับนักศึกษา',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-600 to-cyan-600',
    },
    {
      role: 'advisor',
      title: 'อาจารย์ที่ปรึกษา',
      description: 'เข้าสู่ระบบสำหรับอาจารย์',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      hoverGradient: 'from-green-600 to-emerald-600',
    },
    {
      role: 'admin',
      title: 'ผู้บริหาร',
      description: 'เข้าสู่ระบบสำหรับผู้บริหารคณะ',
      icon: Shield,
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-600 to-pink-600',
    },
    {
      role: 'committee',
      title: 'กรรมการภายนอก',
      description: 'เข้าสู่ระบบสำหรับกรรมการประเมิน',
      icon: Briefcase,
      gradient: 'from-orange-500 to-red-500',
      hoverGradient: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">กลับไปหน้าแรก</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                เลือกบทบาทของคุณ
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เลือกบทบาทที่ตรงกับคุณเพื่อเข้าสู่ระบบ
            </p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.role}
                    onClick={() => onRoleSelect(option.role)}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl border-2 border-gray-200 hover:border-transparent transform hover:-translate-y-3 transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm group-hover:text-white/90 transition-colors duration-300">
                        {option.description}
                      </p>

                      {/* Arrow Icon */}
                      <div className="mt-6 flex items-center gap-2 text-blue-600 group-hover:text-white transition-colors duration-300">
                        <span className="font-medium text-sm">เลือก</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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

