import { ActionItem } from '../types';
import { mockUsers } from '../data/mockData';
import { CheckSquare, AlertCircle, Clock } from 'lucide-react';

interface ActionItemsListProps {
  items: ActionItem[];
}

export function ActionItemsList({ items }: ActionItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p>ไม่มีงานในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const assignee = mockUsers.find(u => u.id === item.assignedTo);
        const dueDate = new Date(item.dueDate);
        const isOverdue = dueDate < new Date() && item.status !== 'completed';
        const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div 
            key={item.id} 
            className={`border rounded-lg p-4 transition-colors ${
              item.status === 'completed' ? 'border-gray-200 bg-gray-50' :
              isOverdue ? 'border-red-200 bg-red-50' :
              daysUntilDue <= 3 ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="shrink-0 mt-1">
                {item.status === 'completed' ? (
                  <CheckSquare className="w-5 h-5 text-green-600" />
                ) : isOverdue ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <div className={`w-5 h-5 border-2 rounded ${
                    item.status === 'in-progress' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`mb-2 ${
                  item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {item.description}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {/* Assignee */}
                  <div className="text-gray-600">
                    {assignee?.name}
                  </div>

                  {/* Due Date */}
                  <div className={`flex items-center gap-1 ${
                    isOverdue ? 'text-red-600' :
                    daysUntilDue <= 3 ? 'text-yellow-700' :
                    'text-gray-600'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {dueDate.toLocaleDateString('th-TH', {
                      month: 'short',
                      day: 'numeric'
                    })}
                    {!isOverdue && item.status !== 'completed' && daysUntilDue >= 0 && (
                      <span className="text-xs">
                        ({daysUntilDue === 0 ? 'วันนี้' : `อีก ${daysUntilDue} วัน`})
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-xs">(เกินกำหนด)</span>
                    )}
                  </div>

                  {/* Priority */}
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority}
                  </span>

                  {/* Status Badge */}
                  {item.status === 'in-progress' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      กำลังทำ
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
