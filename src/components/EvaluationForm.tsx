import { useState } from 'react';
import { mockProjects, mockUsers } from '../data/mockData';
import { X, Star, Plus, Trash2 } from 'lucide-react';

interface EvaluationFormProps {
  projectId: string;
  onClose: () => void;
}

const defaultCategories = [
  { category: 'Technical Implementation', maxScore: 50 },
  { category: 'Innovation & Creativity', maxScore: 20 },
  { category: 'Project Management', maxScore: 15 },
  { category: 'Presentation', maxScore: 15 },
];

export function EvaluationForm({ projectId, onClose }: EvaluationFormProps) {
  const project = mockProjects.find(p => p.id === projectId);
  const students = project ? mockUsers.filter(u => project.teamMembers.includes(u.id)) : [];
  const advisor = project ? mockUsers.find(u => u.id === project.advisorId) : null;

  const [scores, setScores] = useState(
    defaultCategories.map(cat => ({ ...cat, score: 0 }))
  );
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState(['']);
  const [improvements, setImprovements] = useState(['']);

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const maxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0;

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores];
    newScores[index].score = Math.min(value, newScores[index].maxScore);
    setScores(newScores);
  };

  const addStrength = () => setStrengths([...strengths, '']);
  const updateStrength = (index: number, value: string) => {
    const newStrengths = [...strengths];
    newStrengths[index] = value;
    setStrengths(newStrengths);
  };
  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const addImprovement = () => setImprovements([...improvements, '']);
  const updateImprovement = (index: number, value: string) => {
    const newImprovements = [...improvements];
    newImprovements[index] = value;
    setImprovements(newImprovements);
  };
  const removeImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('บันทึกการประเมินสำเร็จ! (Demo mode)');
    onClose();
  };

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">ประเมินโปรเจกต์</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Project Info */}
          <div>
            <h3 className="text-gray-900 mb-2">{project.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>นักศึกษา: {students.map(s => s.name).join(', ')}</div>
              <div>อาจารย์ที่ปรึกษา: {advisor?.name}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Scoring Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">คะแนนประเมิน</h3>
              <div className="text-right">
                <div className="text-gray-900">
                  {totalScore}/{maxScore}
                </div>
                <div className="text-sm text-gray-500">{percentage}%</div>
              </div>
            </div>

            <div className="space-y-4">
              {scores.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-700">{item.category}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={item.maxScore}
                        value={item.score}
                        onChange={(e) => handleScoreChange(index, parseFloat(e.target.value) || 0)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">/ {item.maxScore}</span>
                    </div>
                  </div>
                  
                  {/* Score Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Comments */}
          <div>
            <label className="block text-gray-700 mb-2">
              ความเห็นโดยรวม
            </label>
            <textarea
              required
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="แสดงความเห็นโดยรวมเกี่ยวกับโปรเจกต์"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Strengths */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-green-600" />
                จุดแข็ง
              </label>
              <button
                type="button"
                onClick={addStrength}
                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                เพิ่ม
              </button>
            </div>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => updateStrength(index, e.target.value)}
                    placeholder="จุดแข็งของโปรเจกต์"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {strengths.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStrength(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700 flex items-center gap-2">
                ข้อเสนอแนะเพื่อการปรับปรุง
              </label>
              <button
                type="button"
                onClick={addImprovement}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                เพิ่ม
              </button>
            </div>
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={improvement}
                    onChange={(e) => updateImprovement(index, e.target.value)}
                    placeholder="ข้อเสนอแนะเพื่อการพัฒนา"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {improvements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImprovement(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm text-orange-900 mb-2">สรุปการประเมิน</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-orange-700">คะแนนรวม</div>
                <div className="text-orange-900">
                  {totalScore}/{maxScore} ({percentage}%)
                </div>
              </div>
              <div>
                <div className="text-orange-700">เกรด</div>
                <div className="text-orange-900">
                  {parseFloat(percentage.toString()) >= 80 ? 'A' :
                   parseFloat(percentage.toString()) >= 70 ? 'B+' :
                   parseFloat(percentage.toString()) >= 60 ? 'B' :
                   parseFloat(percentage.toString()) >= 50 ? 'C+' : 'C'}
                </div>
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              บันทึกการประเมิน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
