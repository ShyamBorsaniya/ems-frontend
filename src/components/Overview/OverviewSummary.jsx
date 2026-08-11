import React from 'react';

export default function OverviewSummary({ employeesCount = 0, projectsCount = 0 }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">📊 Executive Overview & System Health</span>
      </div>
      <p style={{ color: '#475569', fontSize: '0.95rem' }}>
        All systems operating normally. <strong>{employeesCount} active users</strong>, <strong>{projectsCount} projects</strong> running across 5 departments.
      </p>
    </div>
  );
}
