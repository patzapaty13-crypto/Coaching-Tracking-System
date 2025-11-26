import { useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { GraduationCap, Users, Shield, Briefcase } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');

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

  const handleRoleSelect = (role: string) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-blue-900">
              SPU Coaching Platform
            </h1>
          </div>
          <p className="text-gray-600">
            ระบบบริหารจัดการ Project-based Learning และ Coaching
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.role}
                onClick={() => handleRoleSelect(option.role)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className={`${option.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-500 text-sm">{option.description}</p>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/50 backdrop-blur rounded-2xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-blue-600 mb-2">📊 Auto Tracking</div>
              <p className="text-gray-600 text-sm">
                บันทึก Coaching Session อัตโนมัติพร้อม Timeline
              </p>
            </div>
            <div>
              <div className="text-green-600 mb-2">🤖 AI Assistant</div>
              <p className="text-gray-600 text-sm">
                AI Agent ช่วยสรุปและแนะนำ Action Items
              </p>
            </div>
            <div>
              <div className="text-purple-600 mb-2">📱 All-in-One</div>
              <p className="text-gray-600 text-sm">
                รวมข้อมูลทุกอย่างไว้ในที่เดียว ไม่ต้องใช้ Line/Excel
              </p>
            </div>
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>🎯 Demo Version - คลิกเลือก Role เพื่อเข้าสู่ระบบ</p>
        </div>
      </div>
    </div>
  );
}
