import React from 'react';

export default function UserManagement({
  filteredEmployees,
  deptFilter,
  setDeptFilter,
  triggerToast,
  setShowAddUserModal
}) {
  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">👥 User Roster & Staff Directory</span>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Department Filter:</span>
            <select
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.85rem'
              }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {setShowAddUserModal && (
            <button className="admin-btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => setShowAddUserModal(true)}>
              + Onboard User
            </button>
          )}
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role & Title</th>
              <th>Department</th>
              <th>Attendance Status</th>
              <th>Account Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div className="admin-user-cell">
                    <img src={emp.avatar} alt={emp.name} className="admin-table-avatar" />
                    <div className="admin-user-cell-meta">
                      <span className="admin-user-cell-name">{emp.name}</span>
                      <span className="admin-user-cell-email">{emp.email}</span>
                    </div>
                  </div>
                </td>
                <td>{emp.role}</td>
                <td>{emp.department}</td>
                <td>
                  <span className={`admin-badge badge-${emp.status.toLowerCase().replace(' ', '')}`}>
                    ● {emp.status}
                  </span>
                </td>
                <td>
                  <span style={{ color: emp.accountStatus === 'Active' ? '#059669' : '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                    {emp.accountStatus}
                  </span>
                </td>
                <td>
                  <button
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(79, 70, 229, 0.08)',
                      color: '#4f46e5',
                      border: '1px solid rgba(79, 70, 229, 0.25)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => triggerToast(`Viewing profile for ${emp.name}`)}
                  >
                    View Details
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
