import React, { useState } from 'react';

export default function Settings({ triggerToast }) {
  const [appName, setAppName] = useState('WorkPulse EMS');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const handleSave = (e) => {
    e.preventDefault();
    if (triggerToast) {
      triggerToast('System settings updated successfully!');
    }
  };

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
        maxWidth: '800px'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: '#0f172a' }}>System Configuration & Settings</h2>
        <p style={{ margin: '0 0 2rem 0', color: '#64748b', fontSize: '0.9rem' }}>
          Manage global enterprise platform settings, authentication parameters, and notification channels.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Portal Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Session Inactivity Timeout (Minutes)</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.95rem'
              }}
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="120">120 Minutes</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              Enable Automated System Email Notifications
            </label>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
