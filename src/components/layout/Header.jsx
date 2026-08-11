import React from 'react';

export default function Header({ user, searchTerm, setSearchTerm, activeTab }) {
  const avatarUrl = user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Admin')}&background=4f46e5&color=fff`;

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'user':
        return '👥 User Directory';
      case 'project':
        return '🚀 Projects';
      case 'department':
        return '🏢 Departments';
      case 'role':
        return '🔑 Roles & Permissions';
      case 'overview':
        return '📊 Overview';
      case 'settings':
        return '⚙️ System Settings';
      default:
        return '📊 Console';
    }
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h2 className="admin-topbar-title">{getTabTitle(activeTab)}</h2>
        <div className="admin-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${activeTab || 'users'}, projects, files...`}
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-badge-live">
          <span className="live-dot"></span> System Online
        </div>

        <button className="topbar-icon-btn" title="Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-user-profile">
          <img src={avatarUrl} alt="User Avatar" className="topbar-avatar" />
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name || user?.username || 'Executive User'}</span>
            <span className="topbar-user-role">{user?.role_name || user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

