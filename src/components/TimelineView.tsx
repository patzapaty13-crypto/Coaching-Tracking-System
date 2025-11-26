import { CoachingSession } from '../types';
import { mockUsers, mockProjects } from '../data/mockData';
import { Calendar, Clock, Users, FileText, CheckSquare, AlertCircle } from 'lucide-react';

interface TimelineViewProps {
  sessions: CoachingSession[];
  userId: string;
}

export function TimelineView({ sessions, userId }: TimelineViewProps) {
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-gray-900 mb-6">Timeline - Coaching History</h2>
      
      {sortedSessions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">ยังไม่มี Coaching Session</h3>
          <p className="text-gray-600">
            เมื่อมีการบันทึก Coaching Session จะแสดงที่นี่
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {sortedSessions.map((session, index) => {
              const project = mockProjects.find(p => p.id === session.projectId);
              const students = mockUsers.filter(u => session.studentIds.includes(u.id));
              const advisor = mockUsers.find(u => u.id === session.advisorId);
              
              const completedItems = session.actionItems.filter(item => item.status === 'completed').length;
              const totalItems = session.actionItems.length;
              
              return (
                <div key={session.id} className="relative pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow" />
                  
                  {/* Date Label */}
                  <div className="absolute left-0 top-0 text-sm text-gray-500 w-14 text-right pr-3">
                    {new Date(session.date).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                  
                  {/* Content Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">{project?.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {students.map(s => s.name).join(', ')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration} นาที
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">หัวข้อที่พูดคุย:</div>
                      <div className="flex flex-wrap gap-2">
                        {session.topics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">สรุป:</div>
                      <p className="text-gray-700">{session.summary}</p>
                    </div>

                    {/* Action Items */}
                    {session.actionItems.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Action Items:</div>
                          <div className="text-sm text-gray-500">
                            {completedItems}/{totalItems} เสร็จแล้ว
                          </div>
                        </div>
                        <div className="space-y-2">
                          {session.actionItems.slice(0, 3).map((item) => {
                            const assignee = mockUsers.find(u => u.id === item.assignedTo);
                            const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
                            
                            return (
                              <div key={item.id} className="flex items-start gap-3 text-sm">
                                {item.status === 'completed' ? (
                                  <CheckSquare className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                ) : isOverdue ? (
                                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-gray-300 rounded shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <div className={item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                    {item.description}
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span>{assignee?.name}</span>
                                    <span className={isOverdue ? 'text-red-600' : ''}>
                                      กำหนดส่ง: {new Date(item.dueDate).toLocaleDateString('th-TH', {
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.priority}
                                </span>
                              </div>
                            );
                          })}
                          {session.actionItems.length > 3 && (
                            <div className="text-sm text-gray-500 pl-7">
                              +{session.actionItems.length - 3} รายการเพิ่มเติม
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Evidence Files */}
                    {session.evidenceFiles.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">ไฟล์แนบ:</div>
                        <div className="flex flex-wrap gap-2">
                          {session.evidenceFiles.map((file) => (
                            <button
                              key={file.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              {file.fileName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Session */}
                    {session.nextSessionDate && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-900">
                          นัดหมายครั้งถัดไป: {new Date(session.nextSessionDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
