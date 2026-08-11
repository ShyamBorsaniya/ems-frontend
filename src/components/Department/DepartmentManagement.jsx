import React from 'react';

export default function DepartmentManagement() {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">🏢 Department Structure & Allocation</span>
      </div>

      <div className="admin-dept-grid">
        <div className="admin-dept-card">
          <div className="admin-dept-header">
            <span className="admin-dept-name">💻 Engineering & Product</span>
            <span className="admin-dept-count">2 Headcount</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>Lead: Sarah Connor</p>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>● 100% Present Today</div>
        </div>

        <div className="admin-dept-card">
          <div className="admin-dept-header">
            <span className="admin-dept-name">📈 Sales & Business Dev</span>
            <span className="admin-dept-count">2 Headcount</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>Lead: Jim Halpert</p>
          <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>● 1 On Leave / 1 Present</div>
        </div>

        <div className="admin-dept-card">
          <div className="admin-dept-header">
            <span className="admin-dept-name">🤝 Human Resources</span>
            <span className="admin-dept-count">1 Headcount</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>Lead: Pam Beesly</p>
          <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>● 1 Remote Active</div>
        </div>

        <div className="admin-dept-card">
          <div className="admin-dept-header">
            <span className="admin-dept-name">💰 Finance & Accounting</span>
            <span className="admin-dept-count">1 Headcount</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 0.5rem 0' }}>Lead: Angela Martin</p>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>● 100% Present Today</div>
        </div>
      </div>
    </div>
  );
}
