import React, { useState } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit weekly sprint update report', priority: 'high', completed: false, due: 'Today' },
    { id: 2, title: 'Review API specification for auth endpoint', priority: 'medium', completed: true, due: 'Yesterday' },
    { id: 3, title: 'Update personal emergency contact details', priority: 'low', completed: false, due: 'Aug 15' },
    { id: 4, title: 'Complete annual cybersecurity awareness quiz', priority: 'high', completed: false, due: 'Aug 18' }
  ]);

  const toggleTaskCompleted = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <EmployeeLayout>
      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Assigned Tasks</h2>
          <div className="flex flex-col gap-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompleted(task.id)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getPriorityBadgeStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-slate-500">Due: {task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
