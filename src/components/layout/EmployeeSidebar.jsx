import React from 'react';

export default function EmployeeSidebar({ activeTab = 'dashboard', onTabChange, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: '🏠' },
    { id: 'attendance', label: 'Attendance Log', icon: '⏱️' },
    { id: 'tasks', label: 'My Tasks', icon: '📋', badge: '3' },
    { id: 'leaves', label: 'Leave Portal', icon: '🏖️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'help', label: 'Support Desk', icon: '❓' }
  ];

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Employee')}&background=10b981&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;

  return (
    <aside className="admin-sidebar" style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <span className="sidebar-brand-title" style={{ display: 'block' }}>WorkPulse EMS</span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee Portal</span>
          </div>
        </div>

        <div className="sidebar-menu-label">Employee Portal</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              style={activeTab === item.id ? { background: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.25)' } : {}}
              onClick={() => onTabChange && onTabChange(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="sidebar-count-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <img src={avatarUrl} alt="Avatar" className="sidebar-avatar" style={{ borderColor: '#10b981' }} />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || user?.username || 'Employee'}</span>
            <span className="sidebar-user-role" style={{ color: '#059669' }}>{user?.role_name || user?.role || 'Staff Member'}</span>
          </div>
        </div>

        <button className="sidebar-btn-logout" onClick={onLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
