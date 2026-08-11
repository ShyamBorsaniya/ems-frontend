import React from 'react';

export default function OverviewSummary({
  adminName = 'User',
  employees = [],
  projects = [],
  roles = [],
  triggerToast
}) {
  const inProgressProjectsCount = projects.filter(p => p.status === 'In Progress').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Welcome Banner */}
      <div className="admin-hero-card">
        <div className="admin-hero-text">
          <h1>Welcome, {adminName.split(' ')[0]} 👋</h1>
          <p>WorkPulse Management Console — Streamlining users, projects, departments, and roles.</p>
        </div>

        <div className="admin-hero-actions">
          <button className="admin-btn-secondary" onClick={() => triggerToast && triggerToast('Exporting Report (CSV)...')}>
            📥 Export Statement
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Users</span>
            <div className="admin-stat-icon stat-icon-indigo">👥</div>
          </div>
          <div className="admin-stat-value">{employees.length} Active</div>
          <div className="admin-stat-subtext">Across 5 Departments</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Active Projects</span>
            <div className="admin-stat-icon stat-icon-cyan">🚀</div>
          </div>
          <div className="admin-stat-value">{projects.length} Initiatives</div>
          <div className="admin-stat-subtext">{inProgressProjectsCount} In Progress</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Configured Roles</span>
            <div className="admin-stat-icon stat-icon-amber">🔑</div>
          </div>
          <div className="admin-stat-value">{roles.length} Tiered Roles</div>
          <div className="admin-stat-subtext">Access Matrix Enforced</div>
        </div>
      </div>

      {/* Executive Overview Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">📊 Executive Overview & System Health</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          All systems operating normally. <strong>{employees.length} active users</strong>, <strong>{projects.length} projects</strong> running across 5 departments.
        </p>
      </div>
    </div>
  );
}

