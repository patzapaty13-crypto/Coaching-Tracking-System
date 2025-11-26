import { GraduationCap, Users, Shield, Briefcase, TrendingUp, Bot, Layout } from 'lucide-react';

interface RoleSelectionPageProps {
  onRoleSelect: (role: string) => void;
}

export function RoleSelectionPage({ onRoleSelect }: RoleSelectionPageProps) {
  const roleOptions = [
    {
      role: 'student',
      title: 'นักศึกษา',
      description: 'เข้าสู่ระบบสำหรับนักศึกษา',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      role: 'advisor',
      title: 'อาจารย์ที่ปรึกษา',
      description: 'เข้าสู่ระบบสำหรับอาจารย์',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      role: 'admin',
      title: 'ผู้บริหาร',
      description: 'เข้าสู่ระบบสำหรับผู้บริหารคณะ',
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      role: 'committee',
      title: 'กรรมการภายนอก',
      description: 'เข้าสู่ระบบสำหรับกรรมการประเมิน',
      icon: Briefcase,
      color: 'bg-orange-500',
    },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Auto Tracking',
      description: 'บันทึก Coaching Session อัตโนมัติพร้อม Timeline',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'AI Agent ช่วยสรุปและแนะนำ Action Items',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layout,
      title: 'All-in-One',
      description: 'รวมข้อมูลทุกอย่างไว้ในที่เดียว ไม่ต้องใช้ Line/Excel',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-600">
              SPU Coaching Platform
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            ระบบบริหารจัดการ Project-based Learning และ Coaching
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.role}
                onClick={() => onRoleSelect(option.role)}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
              >
                <div className={`${option.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">Demo Version - คลิกเลือก Role เพื่อเข้าสู่ระบบ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
