import React from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';

export default function Profile({ user }) {
  const avatarUrl = user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Employee')}&background=10b981&color=fff`;

  return (
    <EmployeeLayout>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <img src={avatarUrl} alt="Profile Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #10b981' }} />
            <div>
              <h2 style={{ margin: 0, color: '#0f172a' }}>{user?.name || user?.username || 'Employee Profile'}</h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748b' }}>{user?.role_name || user?.role || 'Employee'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>EMPLOYEE ID</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{user?.employeeId || `EMP-${user?.id || '104'}`}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>WORK EMAIL</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{user?.email || 'employee@company.com'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PHONE NUMBER</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{user?.phone || '+1 (555) 234-5678'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ACCOUNT STATUS</label>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#059669', marginTop: '0.25rem' }}>● Active</div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
