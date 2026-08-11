import React from 'react';

export default function AdminSidebar({ activeTab, onTabChange, user, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'user', label: 'Users', icon: '👥', badge: '7' },
    { id: 'project', label: 'Projects', icon: '🚀', badge: '4' },
    { id: 'department', label: 'Departments', icon: '🏢' },
    { id: 'role', label: 'Roles', icon: '🔑' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const avatarUrl = user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Admin')}&background=4f46e5&color=fff`;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <span className="sidebar-brand-title" style={{ display: 'block' }}>WorkPulse EMS</span>
            <span style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Console</span>
          </div>
        </div>

        <div className="sidebar-menu-label">Admin Navigation</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange && onTabChange(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-count-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <img src={avatarUrl} alt="Avatar" className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || user?.username || 'Admin User'}</span>
            <span className="sidebar-user-role">{user?.role_name || user?.role || 'Administrator'}</span>
          </div>
        </div>

        <button className="sidebar-btn-logout" onClick={onLogout}>
          <span>🚪</span> Admin Logout
        </button>
      </div>
    </aside>
  );
}
