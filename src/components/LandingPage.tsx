import { CheckCircle, TrendingUp, Bot, Layout, BarChart3, Workflow, FileText, ArrowRight, Sparkles, Phone, Mail, ExternalLink, HelpCircle } from 'lucide-react';
import { Facebook, Youtube, Instagram, Linkedin, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
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
      title: 'All-in-One Platform',
      description: 'รวมข้อมูลทุกอย่างไว้ในที่เดียว ไม่ต้องใช้ Line/Excel',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Progress Monitoring',
      description: 'ติดตามความคืบหน้าโปรเจกต์แบบ Real-time',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Workflow,
      title: 'Smart Workflow',
      description: 'จัดการ Action Items และ Task Management อัตโนมัติ',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: FileText,
      title: 'Portfolio Builder',
      description: 'สร้าง Portfolio และ Learning Records อัตโนมัติ',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const benefits = [
    'ไม่มีข้อมูลกระจัดกระจาย - ทุกอย่างอยู่ในที่เดียว',
    'ไม่ต้อง Manual Tracking - ระบบบันทึกอัตโนมัติ',
    'ไม่พึ่ง Line/Excel - ใช้ระบบเดียวครบทุกฟังก์ชัน',
    'ติดตามความคืบหน้าแบบ Real-time',
    'AI ช่วยสรุปและแนะนำ Action Items',
    'สร้าง Portfolio อัตโนมัติ',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDI3NTc7c3RvcC1vcGFjaXR5OjAuOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMGE0YTtzdG9wLW9wYWNpdHk6MC44Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent"></div>
      
      {/* Decorative Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Contact Bar */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
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

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Section - Branding & Content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12">
            {/* University Branding */}
            <div className="mb-8">
              <div className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tight">
                SPU
              </div>
              <div className="text-xl md:text-2xl text-white/90 font-light mb-8">
                SRIPATUM UNIVERSITY
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
              <p className="text-2xl md:text-3xl text-white/90 mb-4">ยินดีต้อนรับ</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 leading-tight">
                Coaching
                <br />
                <span className="text-pink-400">Platform</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 font-light">
                SPU Coaching & Project-based Learning Management System
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-pink-500 border-2 border-pink-400 text-white rounded-xl font-semibold hover:bg-pink-600 hover:border-pink-500 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>เรียนรู้เพิ่มเติม</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>ติดต่อเรา</span>
              </button>
            </div>
          </div>

          {/* Right Section - Features Preview */}
          <div className="hidden lg:flex flex-col justify-center px-8 py-12 max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">คุณสมบัติหลัก</h3>
              <div className="space-y-3">
                {features.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-white/90">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{feature.title}</p>
                        <p className="text-sm text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons - Right Side */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20">
          {[
            { icon: Facebook, color: 'bg-blue-600', name: 'Facebook' },
            { icon: Youtube, color: 'bg-red-600', name: 'YouTube' },
            { icon: Instagram, color: 'bg-pink-600', name: 'Instagram' },
            { icon: Linkedin, color: 'bg-blue-700', name: 'LinkedIn' },
            { icon: MessageCircle, color: 'bg-green-500', name: 'LINE' },
          ].map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href="#"
                className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg`}
                title={social.name}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
              {/* Left */}
              <div>
                <h4 className="font-bold text-lg mb-2">SPU COACHING PLATFORM</h4>
                <p className="text-sm text-white/70">
                  ระบบจัดการ Project-based Learning และ Coaching ที่ทันสมัยและมีประสิทธิภาพ
                </p>
              </div>

              {/* Middle */}
              <div>
                <h4 className="font-bold text-lg mb-2">ติดต่อเรา</h4>
                <p className="text-sm text-white/70 mb-1">มหาวิทยาลัยศรีปทุม</p>
                <p className="text-sm text-white/70 mb-1">โทร: (02) 579-1111</p>
                <p className="text-sm text-white/70">Email: coaching@spu.ac.th</p>
              </div>

              {/* Right */}
              <div>
                <h4 className="font-bold text-lg mb-2">ลิงก์ที่เกี่ยวข้อง</h4>
                <div className="space-y-1 text-sm">
                  <a href="#" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
                    เว็บไซต์หลักมหาวิทยาลัย
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="#" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
                    ระบบอื่นๆ
                  </a>
                  <a href="#" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
                    <HelpCircle className="w-3 h-3" />
                    ความช่วยเหลือ
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-white/60">
              <p>© 2025 Sripatum University. All Rights Reserved.</p>
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
      `}</style>
    </div>
  );
}
