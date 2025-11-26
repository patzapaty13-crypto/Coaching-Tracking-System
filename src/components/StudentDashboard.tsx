import { useState } from 'react';
import { User } from '../types';
import { mockProjects, mockCoachingSessions, mockUsers } from '../data/mockData';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  FileText, 
  User as UserIcon,
  LogOut,
  Clock,
  AlertCircle,
  TrendingUp,
  Upload
} from 'lucide-react';
import { TimelineView } from './TimelineView';
import { ActionItemsList } from './ActionItemsList';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tasks' | 'portfolio'>('overview');

  // Get student's projects
  const myProjects = mockProjects.filter(p => p.teamMembers.includes(user.id));
  
  // Get student's coaching sessions
  const mySessions = mockCoachingSessions.filter(cs => cs.studentIds.includes(user.id));
  
  // Get all action items for this student
  const myActionItems = mySessions.flatMap(session => 
    session.actionItems.filter(item => item.assignedTo === user.id)
  );

  const pendingTasks = myActionItems.filter(item => item.status !== 'completed');
  const completedTasks = myActionItems.filter(item => item.status === 'completed');

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'tasks', label: 'งานของฉัน', icon: CheckSquare },
    { id: 'portfolio', label: 'Portfolio', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">นักศึกษา</div>
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
                      ? 'border-blue-600 text-blue-600'
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">โปรเจกต์ของฉัน</div>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-gray-900">{myProjects.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Coaching Sessions</div>
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-gray-900">{mySessions.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">งานค้าง</div>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-gray-900">{pendingTasks.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">งานเสร็จแล้ว</div>
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-gray-900">{completedTasks.length}</div>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">โปรเจกต์ของฉัน</h2>
              <div className="space-y-4">
                {myProjects.map((project) => {
                  const advisor = mockUsers.find(u => u.id === project.advisorId);
                  return (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <UserIcon className="w-4 h-4" />
                            {advisor?.name}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          project.status === 'implementation' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'testing' ? 'bg-green-100 text-green-700' :
                          project.status === 'design' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">ความคืบหน้า</div>
                          <div className="text-sm text-gray-900">{project.progress}%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tech Stack */}
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

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">งานที่ต้องทำ</h2>
              <ActionItemsList items={pendingTasks.slice(0, 5)} />
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <TimelineView sessions={mySessions} userId={user.id} />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">งานค้าง ({pendingTasks.length})</h2>
              <ActionItemsList items={pendingTasks} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">งานเสร็จแล้ว ({completedTasks.length})</h2>
              <ActionItemsList items={completedTasks} />
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Portfolio</h3>
              <p className="text-gray-600 mb-6">
                สร้าง Portfolio อัตโนมัติจาก Learning Record และโปรเจกต์ของคุณ
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                สร้าง Portfolio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
