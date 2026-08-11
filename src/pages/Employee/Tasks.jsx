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

  return (
    <EmployeeLayout>
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a' }}>My Assigned Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompleted(task.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{
                    fontWeight: 500,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#94a3b8' : '#0f172a'
                  }}>
                    {task.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: task.priority === 'high' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                    color: task.priority === 'high' ? '#e11d48' : '#0284c7'
                  }}>
                    {task.priority}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Due: {task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
