import React from 'react';

export default function RoleManagement({ roles, setShowAddRoleModal, triggerToast }) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">🔑 Role Definition & Permission Matrix</span>
        <button className="admin-btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setShowAddRoleModal(true)}>
          + Define New Role
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role Title</th>
              <th>Hierarchy Level</th>
              <th>Assigned Users</th>
              <th>Granted Permissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{r.title}</td>
                <td>
                  <span className="admin-badge badge-remote">{r.level}</span>
                </td>
                <td>{r.usersCount} Staff Members</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {r.permissions.map((perm, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #e2e8f0'
                      }}>
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => triggerToast(`Configuring matrix for ${r.title}`)}
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
