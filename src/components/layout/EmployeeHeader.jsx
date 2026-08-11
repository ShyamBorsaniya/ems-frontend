import React from 'react';

export default function EmployeeHeader({
  user,
  searchTerm,
  setSearchTerm,
  activeTab,
  isPunchedIn = true,
  togglePunchStatus,
  onLogout
}) {
  return (
    <header className="emp-navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.85rem 2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', display: 'block', lineHeight: 1.2 }}>Employee Portal</span>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Self-Service Desk</span>
          </div>
        </div>

        {setSearchTerm && (
          <div className="admin-search-wrapper" style={{ marginLeft: '1rem' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search my tasks, leaves, policies..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
        )}
      </div>

      <div className="emp-nav-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {togglePunchStatus && (
          <button
            className={`emp-punch-toggle ${isPunchedIn ? 'punched-in' : 'punched-out'}`}
            onClick={togglePunchStatus}
            title={isPunchedIn ? "Click to Punch Out" : "Click to Punch In"}
          >
            <span className="emp-pulse-dot"></span>
            <span>{isPunchedIn ? 'Punched In' : 'Punched Out'}</span>
          </button>
        )}

        <button className="topbar-icon-btn" title="My Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>

        {onLogout && (
          <button className="emp-btn-logout" onClick={onLogout} title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
