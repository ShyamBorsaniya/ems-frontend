import React from 'react';

export default function ProjectManagement({ projects, setShowAddProjModal }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">🚀 Enterprise Projects & Delivery Status</span>
        <button className="admin-btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setShowAddProjModal(true)}>
          + Add Project
        </button>
      </div>

      <div className="admin-proj-grid">
        {projects.map(proj => (
          <div key={proj.id} className="admin-proj-card">
            <div className="admin-proj-header">
              <div>
                <div className="admin-proj-title">{proj.name}</div>
                <div className="admin-proj-lead">Lead: {proj.lead} ({proj.dept})</div>
              </div>
              <span className={`admin-badge ${
                proj.status === 'Completed' ? 'badge-present' :
                proj.status === 'Testing' ? 'badge-remote' : 'badge-leave'
              }`}>
                {proj.status}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '0.3rem' }}>
                <span>Progress Completion</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{proj.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', color: '#64748b' }}>
              <span>Deadline: {proj.deadline}</span>
              <span style={{ color: '#4f46e5', fontWeight: 600 }}>Budget: {proj.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
