import React, { useState, useEffect } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';

export default function EmployeeDashboard({ user, onLogout }) {
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchTime, setPunchTime] = useState('09:00 AM');
  const [workSeconds, setWorkSeconds] = useState(14520);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Paid Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Sample Leave History Data
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'Paid Leave', from: '2026-07-10', to: '2026-07-12', days: 3, status: 'Approved' },
    { id: 2, type: 'Sick Leave', from: '2026-06-01', to: '2026-06-01', days: 1, status: 'Approved' },
    { id: 3, type: 'Casual Leave', from: '2026-08-20', to: '2026-08-21', days: 2, status: 'Pending' }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit weekly sprint update report', priority: 'high', completed: false, due: 'Today' },
    { id: 2, title: 'Review API specification for auth endpoint', priority: 'medium', completed: true, due: 'Yesterday' },
    { id: 3, title: 'Update personal emergency contact details', priority: 'low', completed: false, due: 'Aug 15' },
    { id: 4, title: 'Complete annual cybersecurity awareness quiz', priority: 'high', completed: false, due: 'Aug 18' }
  ]);

  // Live Timer
  useEffect(() => {
    let interval = null;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const togglePunchStatus = () => {
    if (isPunchedIn) {
      setIsPunchedIn(false);
    } else {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    const newLeave = {
      id: Date.now(),
      type: leaveType,
      from: startDate,
      to: endDate,
      days: 1,
      status: 'Pending'
    };
    setLeaveHistory([newLeave, ...leaveHistory]);
    setShowLeaveModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const userName = user?.name || user?.username || 'Employee User';

  return (
    <EmployeeLayout
      user={user}
      onLogout={onLogout}
      isPunchedIn={isPunchedIn}
      togglePunchStatus={togglePunchStatus}
    >
      <div className="emp-dashboard-container">
        {/* Ambient Lighting Orbs */}
        <div className="emp-ambient-bg">
          <div className="emp-orb emp-orb-1"></div>
          <div className="emp-orb emp-orb-2"></div>
        </div>

        {/* Main Content */}
        <main className="emp-main-content">
          <div className="emp-hero-card">
            <div className="emp-hero-text">
              <h1>Good Day, {userName.split(' ')[0]}! 👋</h1>
              <p>Here is your daily work summary, attendance status, and pending tasks.</p>
            </div>

            <div className="emp-hero-status">
              <div className="emp-clock-display">{formatTimer(workSeconds)}</div>
              <div className="emp-date-display">
                {isPunchedIn ? `Logged in at ${punchTime}` : 'Currently Clocked Out'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="emp-stats-grid">
            <div className="emp-stat-card">
              <div className="emp-stat-header">
                <span className="emp-stat-title">Attendance Rate</span>
                <div className="emp-stat-icon-wrapper icon-blue">📅</div>
              </div>
              <div className="emp-stat-value">96.8%</div>
              <div className="emp-stat-subtext">21 Days Present this month</div>
            </div>

            <div className="emp-stat-card">
              <div className="emp-stat-header">
                <span className="emp-stat-title">Leave Balance</span>
                <div className="emp-stat-icon-wrapper icon-emerald">🏖️</div>
              </div>
              <div className="emp-stat-value">14 Days</div>
              <div className="emp-stat-subtext">10 Paid / 4 Sick leaves available</div>
            </div>

            <div className="emp-stat-card">
              <div className="emp-stat-header">
                <span className="emp-stat-title">Work Hours Logged</span>
                <div className="emp-stat-icon-wrapper icon-purple">⏱️</div>
              </div>
              <div className="emp-stat-value">38.5 hrs</div>
              <div className="emp-stat-subtext">Target: 40.0 hrs / week</div>
            </div>

            <div className="emp-stat-card">
              <div className="emp-stat-header">
                <span className="emp-stat-title">My Tasks</span>
                <div className="emp-stat-icon-wrapper icon-amber">📋</div>
              </div>
              <div className="emp-stat-value">{tasks.filter(t => !t.completed).length} Pending</div>
              <div className="emp-stat-subtext">{tasks.filter(t => t.completed).length} Completed</div>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="emp-layout-grid">
            <div className="emp-left-col">
              {/* Tasks Card */}
              <div className="emp-card">
                <div className="emp-card-header">
                  <span className="emp-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    My Tasks & Action Items
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {tasks.filter(t => t.completed).length}/{tasks.length} Completed
                  </span>
                </div>

                <div className="emp-tasks-list">
                  {tasks.map(task => (
                    <div key={task.id} className="emp-task-item">
                      <div className="emp-task-left">
                        <input
                          type="checkbox"
                          className="emp-checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompleted(task.id)}
                        />
                        <span className={`emp-task-title ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`emp-priority-tag tag-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Due: {task.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave History Card */}
              <div className="emp-card">
                <div className="emp-card-header">
                  <span className="emp-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    My Leave Requests & History
                  </span>

                  <button className="emp-btn-action" onClick={() => setShowLeaveModal(true)}>
                    + Apply New Leave
                  </button>
                </div>

                <div className="emp-table-wrapper">
                  <table className="emp-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Days</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveHistory.map(item => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>{item.type}</td>
                          <td>{item.from}</td>
                          <td>{item.to}</td>
                          <td>{item.days} Day(s)</td>
                          <td>
                            <span className={`emp-status-badge status-${item.status.toLowerCase()}`}>
                              ● {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="emp-right-col">
              <div className="emp-card">
                <div className="emp-card-header">
                  <span className="emp-card-title">📢 Announcements</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #4f46e5' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Annual All-Hands Meeting</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Aug 25 at 10:00 AM • Main Auditorium & Virtual</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #059669' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Q3 Performance Appraisals</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Self-evaluation portal opens Sep 01</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Apply Leave Modal */}
        {showLeaveModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <div style={{
              width: '100%', maxWidth: '480px', background: '#ffffff',
              border: '1px solid #e2e8f0', borderRadius: '16px',
              padding: '1.75rem', color: '#0f172a', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Apply for Time Off</h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                  onClick={() => setShowLeaveModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyLeaveSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Leave Category</label>
                  <select
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="Paid Leave">Paid Annual Leave</option>
                    <option value="Sick Leave">Medical / Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Start Date</label>
                    <input
                      type="date"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>End Date</label>
                    <input
                      type="date"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Reason / Note</label>
                  <textarea
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                    rows="3"
                    placeholder="Briefly state reason for leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => setShowLeaveModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Submit Leave Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
