import React from 'react';

export default function EmployeeFooter() {
  return (
    <footer style={{
      padding: '1.1rem 2rem',
      borderTop: '1px solid #e2e8f0',
      background: '#ffffff',
      color: '#64748b',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>WorkPulse Employee Portal</span>
        <span>•</span>
        <span>© {new Date().getFullYear()} Self-Service Desk. All rights reserved.</span>
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 500, alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', color: '#10b981' }}>Employee Handbook</span>
        <span style={{ cursor: 'pointer' }}>IT Support Desk</span>
        <span style={{ cursor: 'pointer' }}>HR Policies</span>
        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
          🟢 HR System Active
        </span>
      </div>
    </footer>
  );
}
