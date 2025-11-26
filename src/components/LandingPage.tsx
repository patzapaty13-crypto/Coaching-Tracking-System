import { TrendingUp, Bot, Layout, ArrowRight, Phone, Mail, ExternalLink, HelpCircle, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: TrendingUp,
      title: 'Auto Tracking',
      description: 'บันทึก Coaching Session อัตโนมัติพร้อม Timeline',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'AI Agent ช่วยสรุปและแนะนำ Action Items',
    },
    {
      icon: Layout,
      title: 'All-in-One Platform',
      description: 'รวมข้อมูลทุกอย่างไว้ในที่เดียว ไม่ต้องใช้ Line/Excel',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Contact Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span>โทร: (02) 579-1111</span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span>อีเมล: coaching@spu.ac.th</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Section - Branding & Welcome */}
          <div className="space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
                <span className="block">ยินดี</span>
                <span className="block">ต้อนรับ</span>
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-wide">
                SRIPATUM
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 tracking-wide">
                UNIVERSITY
              </div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                SPU Coaching & Project-based Learning Management System
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Section - Features, Contact, Links */}
          <div className="space-y-8">
            {/* SPU COACHING PLATFORM Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SPU COACHING PLATFORM</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                ระบบจัดการ Project-based Learning และ Coaching ที่ทันสมัยและมีประสิทธิภาพ
              </p>
              
              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm ml-13 pl-13">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: SPU COACHING PLATFORM */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">SPU COACHING PLATFORM</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                ระบบจัดการ Project-based Learning และ Coaching ที่ทันสมัยและมีประสิทธิภาพ
              </p>
            </div>

            {/* Column 2: ติดต่อเรา */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">ติดต่อเรา</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>มหาวิทยาลัยศรีปทุม</p>
                <p>โทร: (02) 579-1111</p>
                <p>Email: coaching@spu.ac.th</p>
              </div>
            </div>

            {/* Column 3: ลิงก์ที่เกี่ยวข้อง */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">ลิงก์ที่เกี่ยวข้อง</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                  <span>เว็บไซต์หลักมหาวิทยาลัย</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors block">
                  ระบบอื่นๆ
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>ความช่วยเหลือ</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">© 2025 Sripatum University. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
