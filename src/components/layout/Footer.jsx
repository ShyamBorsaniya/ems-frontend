import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      padding: '1.25rem 2rem',
      borderTop: '1px solid #e2e8f0',
      background: '#ffffff',
      color: '#64748b',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto'
    }}>
      <div>© {new Date().getFullYear()} WorkPulse Enterprise EMS. All rights reserved.</div>
      <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>v2.4.0</span>
      </div>
    </footer>
  );
}
