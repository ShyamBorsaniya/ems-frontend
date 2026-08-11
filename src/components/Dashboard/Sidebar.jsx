import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  employeesCount = 0,
  projectsCount = 0,
  rolesCount = 0,
  user,
  onLogout
}) {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Admin')}&background=4f46e5&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;
  const adminName = user?.name || user?.username || 'Admin User';
  const roleName = user?.role_name || user?.role || 'Administrator';

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span className="sidebar-brand-title">WorkPulse EMS</span>
        </div>

        <div className="sidebar-menu-label">Main Navigation</div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="sidebar-nav-icon">📊</span>
            <span>Overview</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            <span className="sidebar-nav-icon">👥</span>
            <span>User</span>
            <span className="sidebar-count-badge">{employeesCount}</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'project' ? 'active' : ''}`}
            onClick={() => setActiveTab('project')}
          >
            <span className="sidebar-nav-icon">🚀</span>
            <span>Project</span>
            <span className="sidebar-count-badge">{projectsCount}</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'department' ? 'active' : ''}`}
            onClick={() => setActiveTab('department')}
          >
            <span className="sidebar-nav-icon">🏢</span>
            <span>Department</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'role' ? 'active' : ''}`}
            onClick={() => setActiveTab('role')}
          >
            <span className="sidebar-nav-icon">🔑</span>
            <span>Role</span>
            <span className="sidebar-count-badge">{rolesCount}</span>
          </button>

        </nav>
      </div>

      {/* Sidebar Footer User Info */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <img src={avatarUrl} alt={adminName} className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{adminName}</span>
            <span className="sidebar-user-role">{roleName}</span>
          </div>
        </div>

        <button className="sidebar-btn-logout" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
