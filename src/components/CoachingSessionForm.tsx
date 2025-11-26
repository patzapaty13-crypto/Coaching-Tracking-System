import { useState } from 'react';
import { Project } from '../types';
import { mockUsers } from '../data/mockData';
import { X, Plus, Trash2, Calendar, Clock, Users, FileText } from 'lucide-react';

interface CoachingSessionFormProps {
  onClose: () => void;
  projects: Project[];
}

export function CoachingSessionForm({ onClose, projects }: CoachingSessionFormProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    date: '',
    time: '',
    duration: 60,
    topics: [''],
    summary: '',
    notes: '',
    nextSessionDate: '',
    nextSessionTime: '',
  });

  const [actionItems, setActionItems] = useState([
    { description: '', assignedTo: '', dueDate: '', priority: 'medium' as const }
  ]);

  const selectedProject = projects.find(p => p.id === formData.projectId);
  const students = selectedProject 
    ? mockUsers.filter(u => selectedProject.teamMembers.includes(u.id))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to backend
    alert('บันทึก Coaching Session สำเร็จ! (Demo mode)');
    onClose();
  };

  const addTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ''] });
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const addActionItem = () => {
    setActionItems([...actionItems, { description: '', assignedTo: '', dueDate: '', priority: 'medium' }]);
  };

  const updateActionItem = (index: number, field: string, value: string) => {
    const newItems = [...actionItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setActionItems(newItems);
  };

  const removeActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-gray-900">บันทึก Coaching Session</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              โปรเจกต์
            </label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">เลือกโปรเจกต์</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Students Display */}
          {selectedProject && students.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-900 mb-2">
                <Users className="w-4 h-4" />
                <span>นักศึกษา</span>
              </div>
              <div className="text-sm text-blue-700">
                {students.map(s => s.name).join(', ')}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                วันที่
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                เวลา
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                ระยะเวลา (นาที)
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">หัวข้อที่พูดคุย</label>
              <button
                type="button"
                onClick={addTopic}
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                เพิ่มหัวข้อ
              </button>
            </div>
            <div className="space-y-2">
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder="เช่น Progress Review, Technical Issues"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {formData.topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-gray-700 mb-2">
              สรุปการพูดคุย
            </label>
            <textarea
              required
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="สรุปสิ่งที่พูดคุย ความคืบหน้า ปัญหาที่พบ และแนวทางแก้ไข"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700">Action Items</label>
              <button
                type="button"
                onClick={addActionItem}
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                เพิ่ม Action Item
              </button>
            </div>
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateActionItem(index, 'description', e.target.value)}
                      placeholder="งานที่ต้องทำ"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeActionItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={item.assignedTo}
                      onChange={(e) => updateActionItem(index, 'assignedTo', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">มอบหมายให้</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => updateActionItem(index, 'dueDate', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    <select
                      value={item.priority}
                      onChange={(e) => updateActionItem(index, 'priority', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="low">ความสำคัญต่ำ</option>
                      <option value="medium">ความสำคัญปานกลาง</option>
                      <option value="high">ความสำคัญสูง</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 mb-2">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="บันทึกเพิ่มเติมหรือข้อสังเกต"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Next Session */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-gray-900 mb-3">นัดหมายครั้งถัดไป (ถ้ามี)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">วันที่</label>
                <input
                  type="date"
                  value={formData.nextSessionDate}
                  onChange={(e) => setFormData({ ...formData, nextSessionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-sm">เวลา</label>
                <input
                  type="time"
                  value={formData.nextSessionTime}
                  onChange={(e) => setFormData({ ...formData, nextSessionTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              บันทึก Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
