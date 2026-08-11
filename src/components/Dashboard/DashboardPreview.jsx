import React from 'react';
import './DashboardPreview.css';

export default function DashboardPreview({ user, onLogout }) {
  if (!user) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'User')}&background=3b82f6&color=fff`;
  const avatarUrl = user.profile_image || user.avatar || defaultAvatar;

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="nav-brand">
          <div className="nav-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span className="nav-logo-text">WorkPulse EMS</span>
        </div>

        <div className="nav-user-actions">
          <div className="user-profile-badge">
            <img src={avatarUrl} alt={user.name || user.username} className="avatar-img" />
            <div className="user-info">
              <span className="user-name">{user.name || user.username}</span>
              <span className="user-role-tag">{user.role || 'Employee'} • {user.employeeId || `ID: ${user.id}`}</span>
            </div>
          </div>

          <button className="btn-logout" onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="dashboard-content">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>Welcome back, {(user.name || user.username || 'User').split(' ')[0]}! 👋</h1>
            <p>Logged in as <strong>{user.role_name || user.role || 'Employee'}</strong> ({user.email})</p>
          </div>
          <div className="status-badge">
            <span className="status-dot"></span>
            Session Active ({user.loginTime || 'Now'})
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Attendance Rate</span>
              <div className="stat-icon">📅</div>
            </div>
            <div className="stat-value">98.5%</div>
            <div className="stat-subtext">On track for Q3 goals</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Leave Balance</span>
              <div className="stat-icon">🏖️</div>
            </div>
            <div className="stat-value">14 Days</div>
            <div className="stat-subtext">10 Paid / 4 Sick leaves</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Pending Tasks</span>
              <div className="stat-icon">📋</div>
            </div>
            <div className="stat-value">3 Items</div>
            <div className="stat-subtext">1 Review required</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Security Tokens</span>
              <div className="stat-icon">🔐</div>
            </div>
            <div className="stat-value">{user.tokens?.access ? 'JWT Cached' : 'Active'}</div>
            <div className="stat-subtext">Saved in browser storage</div>
          </div>
        </div>

        {/* Profile / Account Information */}
        <div className="info-section">
          <h3>Authenticated Account Details (Cached Response Data)</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">User ID</span>
              <span className="detail-val">{user.id || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Username</span>
              <span className="detail-val">{user.username || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Work Email</span>
              <span className="detail-val">{user.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role Name</span>
              <span className="detail-val">{user.role_name || user.role || 'Employee'} (ID: {user.role_id || user.role || '5'})</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Status</span>
              <span className="detail-val" style={{ color: user.is_active !== false ? '#34d399' : '#f87171' }}>
                {user.is_active !== false ? '● Active Account' : '○ Inactive'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Storage Persistence</span>
              <span className="detail-val">Access & Refresh Tokens Cached</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
