import React, { useState, useEffect } from 'react';
import './EmployeeDashboard.css';

export default function EmployeeDashboard({ user, onLogout }) {
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchTime, setPunchTime] = useState('09:00 AM');
  const [workSeconds, setWorkSeconds] = useState(14520); // ~4 hours 2 mins
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

  // Live Timer for Work Hours when Punched In
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

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Employee')}&background=10b981&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;
  const userName = user?.name || user?.username || 'Employee User';
  const empId = user?.employeeId || `EMP-${user?.id || '104'}`;

  return (
    <div className="emp-dashboard-container">
      {/* Ambient Lighting Orbs */}
      <div className="emp-ambient-bg">
        <div className="emp-orb emp-orb-1"></div>
        <div className="emp-orb emp-orb-2"></div>
      </div>

      {/* Top Navigation */}
      <header className="emp-navbar">
        <div className="emp-brand">
          <div className="emp-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span className="emp-brand-name">WorkPulse EMS</span>
          <span className="emp-role-badge">Employee Portal</span>
        </div>

        <div className="emp-nav-controls">
          {/* Quick Punch In/Out Toggle */}
          <button
            className={`emp-punch-toggle ${isPunchedIn ? 'punched-in' : 'punched-out'}`}
            onClick={togglePunchStatus}
            title={isPunchedIn ? "Click to Punch Out" : "Click to Punch In"}
          >
            <span className="emp-pulse-dot"></span>
            <span>{isPunchedIn ? 'Punched In' : 'Punched Out'}</span>
          </button>

          {/* User Profile Info */}
          <div className="emp-user-profile">
            <img src={avatarUrl} alt={userName} className="emp-avatar" />
            <div className="emp-user-meta">
              <span className="emp-user-name">{userName}</span>
              <span className="emp-user-sub">{empId}</span>
            </div>
          </div>

          <button className="emp-btn-logout" onClick={onLogout} title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="emp-main-content">
        {/* Welcome Hero Banner */}
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

        {/* Layout Grid (Main Left Content + Sidebar Right Content) */}
        <div className="emp-layout-grid">
          {/* Left Column */}
          <div className="emp-left-col">
            {/* My Tasks Card */}
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

          {/* Right Column */}
          <div className="emp-right-col">
            {/* Announcements Card */}
            <div className="emp-card">
              <div className="emp-card-header">
                <span className="emp-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Company Bulletins
                </span>
              </div>

              <div className="emp-bulletin-item">
                <div className="emp-bulletin-header">
                  <span className="emp-bulletin-tag">Townhall</span>
                  <span className="emp-bulletin-date">Aug 14, 2026</span>
                </div>
                <h4 className="emp-bulletin-title">Q3 All-Hands Company Sync</h4>
                <p className="emp-bulletin-desc">Join us live via Teams for product updates, achievements, and Q&A with leadership.</p>
              </div>

              <div className="emp-bulletin-item">
                <div className="emp-bulletin-header">
                  <span className="emp-bulletin-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                    Holiday Notice
                  </span>
                  <span className="emp-bulletin-date">Aug 15, 2026</span>
                </div>
                <h4 className="emp-bulletin-title">Upcoming Independence Day Holiday</h4>
                <p className="emp-bulletin-desc">The company office will remain closed. Essential maintenance teams remain on standby.</p>
              </div>
            </div>

            {/* My Profile Information Card */}
            <div className="emp-card">
              <div className="emp-card-header">
                <span className="emp-card-title">My Account Info</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>User Role</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>{user?.role_name || user?.role || 'Employee'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Work Email</span>
                  <span style={{ color: '#f8fafc' }}>{user?.email || 'employee@workpulse.com'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Employee ID</span>
                  <span style={{ color: '#f8fafc' }}>{empId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Reporting Manager</span>
                  <span style={{ color: '#60a5fa' }}>Alex Johnson (Tech Lead)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="emp-modal-overlay">
          <div className="emp-modal">
            <div className="emp-modal-header">
              <h3 className="emp-modal-title">Request Time Off / Leave</h3>
              <button
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={() => setShowLeaveModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit}>
              <div className="emp-form-group">
                <label>Leave Category</label>
                <select
                  className="emp-select"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Paid Leave">Paid Annual Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Medical / Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="emp-form-group">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="emp-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="emp-form-group">
                  <label>To Date</label>
                  <input
                    type="date"
                    className="emp-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="emp-form-group">
                <label>Reason / Note for Approver</label>
                <textarea
                  className="emp-textarea"
                  rows="3"
                  placeholder="Provide brief details about your leave application..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>

              <div className="emp-modal-actions">
                <button
                  type="button"
                  className="emp-btn-cancel"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="emp-btn-submit">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
