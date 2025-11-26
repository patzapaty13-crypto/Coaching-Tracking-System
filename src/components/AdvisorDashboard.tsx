import { useState } from 'react';
import { User } from '../types';
import { mockProjects, mockCoachingSessions, mockUsers } from '../data/mockData';
import { 
  Users, 
  Calendar, 
  Plus,
  LogOut,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { CoachingSessionForm } from './CoachingSessionForm';
import { TimelineView } from './TimelineView';

interface AdvisorDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdvisorDashboard({ user, onLogout }: AdvisorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'sessions' | 'timeline'>('overview');
  const [showSessionForm, setShowSessionForm] = useState(false);

  // Get advisor's projects
  const myProjects = mockProjects.filter(p => p.advisorId === user.id);
  
  // Get advisor's coaching sessions
  const mySessions = mockCoachingSessions.filter(cs => cs.advisorId === user.id);
  
  // Get all students under this advisor
  const myStudents = mockUsers.filter(u => 
    u.role === 'student' && myProjects.some(p => p.teamMembers.includes(u.id))
  );

  // Calculate statistics
  const totalSessions = mySessions.length;
  const sessionsThisWeek = mySessions.filter(s => {
    const sessionDate = new Date(s.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  }).length;

  const allActionItems = mySessions.flatMap(s => s.actionItems);
  const pendingItems = allActionItems.filter(item => item.status === 'pending');
  const overdueItems = allActionItems.filter(item => {
    if (item.status === 'completed') return false;
    const dueDate = new Date(item.dueDate);
    return dueDate < new Date();
  });

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: TrendingUp },
    { id: 'students', label: 'นักศึกษา', icon: Users },
    { id: 'sessions', label: 'Coaching Sessions', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">อาจารย์ที่ปรึกษา</div>
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
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowSessionForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors my-2"
            >
              <Plus className="w-4 h-4" />
              บันทึก Session ใหม่
            </button>
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
                  <div className="text-gray-600">โปรเจกต์ทั้งหมด</div>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-gray-900">{myProjects.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">นักศึกษา</div>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-gray-900">{myStudents.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Session สัปดาห์นี้</div>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-gray-900">{sessionsThisWeek}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">งานเกินกำหนด</div>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-gray-900">{overdueItems.length}</div>
              </div>
            </div>

            {/* Projects Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">โปรเจกต์ที่ดูแล</h2>
              <div className="space-y-4">
                {myProjects.map((project) => {
                  const students = mockUsers.filter(u => project.teamMembers.includes(u.id));
                  const projectSessions = mySessions.filter(s => s.projectId === project.id);
                  
                  return (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-2">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Users className="w-4 h-4" />
                              {students.map(s => s.name).join(', ')}
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

                      {/* Progress Bar */}
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

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Coaching Sessions ล่าสุด</h2>
              <div className="space-y-4">
                {mySessions.slice(0, 3).map((session) => {
                  const project = mockProjects.find(p => p.id === session.projectId);
                  const students = mockUsers.filter(u => session.studentIds.includes(u.id));
                  
                  return (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{project?.name}</h3>
                          <div className="text-sm text-gray-500">
                            {students.map(s => s.name).join(', ')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{session.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">นักศึกษาที่ดูแล</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myStudents.map((student) => {
                const studentProjects = myProjects.filter(p => p.teamMembers.includes(student.id));
                const studentSessions = mySessions.filter(s => s.studentIds.includes(student.id));
                const studentTasks = studentSessions.flatMap(s => 
                  s.actionItems.filter(item => item.assignedTo === student.id)
                );
                const pendingTasks = studentTasks.filter(item => item.status !== 'completed');
                
                return (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{student.name}</h3>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">โปรเจกต์:</span>
                        <span className="text-gray-900">{studentProjects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="text-gray-900">{studentSessions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">งานค้าง:</span>
                        <span className={pendingTasks.length > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {pendingTasks.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Coaching Sessions ทั้งหมด</h2>
            <div className="space-y-4">
              {mySessions.map((session) => {
                const project = mockProjects.find(p => p.id === session.projectId);
                const students = mockUsers.filter(u => session.studentIds.includes(u.id));
                
                return (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-gray-900 mb-1">{project?.name}</h3>
                        <div className="text-sm text-gray-500 mb-2">
                          {students.map(s => s.name).join(', ')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          <Clock className="w-4 h-4 ml-2" />
                          {session.duration} นาที
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">หัวข้อที่พูดคุย:</div>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">สรุป:</div>
                      <p className="text-gray-700">{session.summary}</p>
                    </div>

                    {session.actionItems.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Action Items:</div>
                        <div className="space-y-2">
                          {session.actionItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-2 text-sm">
                              {item.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                              )}
                              <span className={item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                {item.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <TimelineView sessions={mySessions} userId={user.id} />
        )}
      </main>

      {/* Session Form Modal */}
      {showSessionForm && (
        <CoachingSessionForm 
          onClose={() => setShowSessionForm(false)}
          projects={myProjects}
        />
      )}
    </div>
  );
}
