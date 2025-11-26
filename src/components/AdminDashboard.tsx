import { useState } from 'react';
import { User } from '../types';
import { mockProjects, mockCoachingSessions, mockUsers } from '../data/mockData';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  LogOut,
  BarChart3,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'analytics' | 'reports'>('overview');

  // Calculate statistics
  const totalProjects = mockProjects.length;
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const totalAdvisors = mockUsers.filter(u => u.role === 'advisor').length;
  const totalSessions = mockCoachingSessions.length;

  // Project status distribution
  const projectsByStatus = {
    proposal: mockProjects.filter(p => p.status === 'proposal').length,
    design: mockProjects.filter(p => p.status === 'design').length,
    implementation: mockProjects.filter(p => p.status === 'implementation').length,
    testing: mockProjects.filter(p => p.status === 'testing').length,
    presentation: mockProjects.filter(p => p.status === 'presentation').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
  };

  // Projects at risk (progress < 50%)
  const projectsAtRisk = mockProjects.filter(p => p.progress < 50);

  // Average progress
  const averageProgress = Math.round(
    mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length
  );

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: TrendingUp },
    { id: 'projects', label: 'โปรเจกต์ทั้งหมด', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'รายงาน', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">ผู้บริหาร</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">โปรเจกต์ทั้งหมด</div>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-gray-900">{totalProjects}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {projectsAtRisk.length} โปรเจกต์มีความเสี่ยง
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">นักศึกษา</div>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-gray-900">{totalStudents}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {totalAdvisors} อาจารย์ที่ปรึกษา
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Coaching Sessions</div>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-gray-900">{totalSessions}</div>
                <div className="text-sm text-gray-500 mt-1">
                  เฉลี่ย {(totalSessions / totalProjects).toFixed(1)} ต่อโปรเจกต์
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">ความคืบหน้าเฉลี่ย</div>
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-gray-900">{averageProgress}%</div>
                <div className="text-sm text-green-600 mt-1">
                  ↑ เพิ่มขึ้น 5% จากเดือนที่แล้ว
                </div>
              </div>
            </div>

            {/* Project Status Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">สถานะโปรเจกต์</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(projectsByStatus).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className={`text-2xl text-gray-900 mb-1`}>{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects at Risk */}
            {projectsAtRisk.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0" />
                  <div>
                    <h2 className="text-orange-900 mb-1">
                      โปรเจกต์ที่ต้องติดตาม ({projectsAtRisk.length})
                    </h2>
                    <p className="text-sm text-orange-700">
                      โปรเจกต์ที่มีความคืบหน้าต่ำกว่า 50%
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {projectsAtRisk.map((project) => {
                    const advisor = mockUsers.find(u => u.id === project.advisorId);
                    return (
                      <div key={project.id} className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{project.name}</h3>
                            <div className="text-sm text-gray-600 mb-2">
                              อาจารย์ที่ปรึกษา: {advisor?.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{project.progress}%</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 shrink-0`}>
                            {project.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Projects Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">โปรเจกต์ทั้งหมด</h2>
              <div className="space-y-4">
                {mockProjects.map((project) => {
                  const advisor = mockUsers.find(u => u.id === project.advisorId);
                  const students = mockUsers.filter(u => project.teamMembers.includes(u.id));
                  const projectSessions = mockCoachingSessions.filter(s => s.projectId === project.id);
                  
                  return (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Users className="w-4 h-4" />
                              {students.map(s => s.name).join(', ')}
                            </div>
                            <div className="text-gray-500">
                              อาจารย์: {advisor?.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {projectSessions.length} sessions
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm shrink-0 ${
                          project.status === 'implementation' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'testing' ? 'bg-green-100 text-green-700' :
                          project.status === 'design' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">ความคืบหน้า</div>
                          <div className="text-sm text-gray-900">{project.progress}%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              project.progress >= 80 ? 'bg-green-600' :
                              project.progress >= 60 ? 'bg-blue-600' :
                              project.progress >= 40 ? 'bg-yellow-600' :
                              'bg-orange-600'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">โปรเจกต์ทั้งหมด</h2>
            <div className="space-y-4">
              {mockProjects.map((project) => {
                const advisor = mockUsers.find(u => u.id === project.advisorId);
                const students = mockUsers.filter(u => project.teamMembers.includes(u.id));
                const projectSessions = mockCoachingSessions.filter(s => s.projectId === project.id);
                
                return (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Users className="w-4 h-4" />
                            {students.map(s => s.name).join(', ')}
                          </div>
                          <div className="text-gray-500">
                            อาจารย์: {advisor?.name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {projectSessions.length} sessions
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm shrink-0 ${
                        project.status === 'implementation' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'testing' ? 'bg-green-100 text-green-700' :
                        project.status === 'design' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">ความคืบหน้า</div>
                        <div className="text-sm text-gray-900">{project.progress}%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            project.progress >= 80 ? 'bg-green-600' :
                            project.progress >= 60 ? 'bg-blue-600' :
                            project.progress >= 40 ? 'bg-yellow-600' :
                            'bg-orange-600'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">การวิเคราะห์ข้อมูล</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-900 mb-4">การกระจายตัวของสถานะโปรเจกต์</h3>
                  <div className="space-y-3">
                    {Object.entries(projectsByStatus).map(([status, count]) => {
                      const percentage = (count / totalProjects) * 100;
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 capitalize">{status}</span>
                            <span className="text-sm text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-4">อัตราส่วน Coaching Sessions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Sessions ต่ออาจารย์</div>
                      <div className="text-gray-900">
                        {(totalSessions / totalAdvisors).toFixed(1)}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Sessions ต่อนักศึกษา</div>
                      <div className="text-gray-900">
                        {(totalSessions / totalStudents).toFixed(1)}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Sessions ต่อโปรเจกต์</div>
                      <div className="text-gray-900">
                        {(totalSessions / totalProjects).toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">ส่งออกรายงาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <Download className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-gray-900 mb-2">รายงานโปรเจกต์ทั้งหมด</h3>
                <p className="text-sm text-gray-600">
                  ส่งออกข้อมูลโปรเจกต์ทั้งหมดเป็นไฟล์ Excel
                </p>
              </button>

              <button className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <Download className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-gray-900 mb-2">รายงาน Coaching Sessions</h3>
                <p className="text-sm text-gray-600">
                  ส่งออกข้อมูล Coaching Sessions ทั้งหมด
                </p>
              </button>

              <button className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <Download className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-gray-900 mb-2">รายงานประเมินผล</h3>
                <p className="text-sm text-gray-600">
                  ส่งออกผลการประเมินจากกรรมการภายนอก
                </p>
              </button>

              <button className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <Download className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-gray-900 mb-2">รายงานสรุปรายเทอม</h3>
                <p className="text-sm text-gray-600">
                  สรุปภาพรวมของภาคการศึกษา
                </p>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
