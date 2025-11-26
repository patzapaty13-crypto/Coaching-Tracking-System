import { useState } from 'react';
import { User, Evaluation } from '../types';
import { mockProjects, mockUsers, mockEvaluations } from '../data/mockData';
import { 
  Briefcase, 
  FileText, 
  CheckSquare,
  LogOut,
  ExternalLink,
  Star,
  MessageSquare,
  Download
} from 'lucide-react';
import { EvaluationForm } from './EvaluationForm';

interface CommitteeDashboardProps {
  user: User;
  onLogout: () => void;
}

export function CommitteeDashboard({ user, onLogout }: CommitteeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'evaluations'>('projects');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Get projects assigned to this committee member
  // Committee can only see projects they are assigned to evaluate
  // For demo: committee can see projects that have evaluations or are in presentation/completed status
  const assignedProjects = mockProjects.filter(p => {
    // If project has evaluation by this committee member, show it
    if (myEvaluations.some(e => e.projectId === p.id)) {
      return true;
    }
    // Committee can see projects ready for evaluation (presentation/completed)
    return p.status === 'presentation' || p.status === 'completed';
  });
  
  // Get evaluations by this committee member
  const myEvaluations = mockEvaluations.filter(e => e.committeeId === user.id);
  const evaluatedProjectIds = myEvaluations.map(e => e.projectId);

  const tabs = [
    { id: 'projects', label: 'โปรเจกต์ที่ต้องประเมิน', icon: FileText },
    { id: 'evaluations', label: 'การประเมินของฉัน', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">กรรมการภายนอก</div>
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
                      ? 'border-orange-600 text-orange-600'
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
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">โปรเจกต์ทั้งหมด</div>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-gray-900">{assignedProjects.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">ประเมินแล้ว</div>
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-gray-900">{myEvaluations.length}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">รอประเมิน</div>
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-gray-900">
                  {assignedProjects.length - myEvaluations.length}
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">โปรเจกต์ที่ต้องประเมิน</h2>
              <div className="space-y-4">
                {assignedProjects.map((project) => {
                  const students = mockUsers.filter(u => project.teamMembers.includes(u.id));
                  const advisor = mockUsers.find(u => u.id === project.advisorId);
                  const isEvaluated = evaluatedProjectIds.includes(project.id);
                  
                  return (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-gray-900">{project.name}</h3>
                            {isEvaluated && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                                <CheckSquare className="w-3 h-3" />
                                ประเมินแล้ว
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                              <span>นักศึกษา:</span>
                              <span className="text-gray-900">
                                {students.map(s => s.name).join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <span>อาจารย์ที่ปรึกษา:</span>
                              <span className="text-gray-900">{advisor?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm shrink-0 ${
                          project.status === 'testing' ? 'bg-green-100 text-green-700' :
                          project.status === 'presentation' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Documents & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Proposal
                          </button>
                          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Final Report
                          </button>
                          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedProject(project.id)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            isEvaluated
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          {isEvaluated ? 'ดูการประเมิน' : 'ประเมินโปรเจกต์'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">การประเมินของฉัน</h2>
            {myEvaluations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">ยังไม่มีการประเมิน</h3>
                <p className="text-gray-600">
                  เมื่อคุณประเมินโปรเจกต์แล้ว จะแสดงรายการที่นี่
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {myEvaluations.map((evaluation) => {
                  const project = mockProjects.find(p => p.id === evaluation.projectId);
                  const students = mockUsers.filter(u => project?.teamMembers.includes(u.id));
                  const totalScore = evaluation.scores.reduce((sum, s) => sum + s.score, 0);
                  const maxScore = evaluation.scores.reduce((sum, s) => sum + s.maxScore, 0);
                  const percentage = ((totalScore / maxScore) * 100).toFixed(0);
                  
                  return (
                    <div key={evaluation.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">{project?.name}</h3>
                          <div className="text-sm text-gray-500">
                            {students.map(s => s.name).join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 mb-1">
                            {totalScore}/{maxScore}
                          </div>
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="space-y-3 mb-4">
                        {evaluation.scores.map((score, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">{score.category}</span>
                              <span className="text-sm text-gray-900">
                                {score.score}/{score.maxScore}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Comments */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">ความเห็นโดยรวม:</div>
                        <p className="text-gray-700">{evaluation.comments}</p>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-green-700 mb-2 flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            จุดแข็ง
                          </div>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {evaluation.strengths.map((strength, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-600 shrink-0">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-sm text-orange-700 mb-2 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            ข้อเสนอแนะ
                          </div>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {evaluation.improvements.map((improvement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-orange-600 shrink-0">•</span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        ประเมินเมื่อ: {new Date(evaluation.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Evaluation Form Modal */}
      {selectedProject && (
        <EvaluationForm
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
