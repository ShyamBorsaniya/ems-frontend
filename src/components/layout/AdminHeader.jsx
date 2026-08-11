import React from 'react';

export default function AdminHeader({ user, searchTerm, setSearchTerm, activeTab }) {
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
        return '📊 Executive Overview';
      case 'settings':
        return '⚙️ System Settings';
      default:
        return '👑 Admin Console';
    }
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h2 className="admin-topbar-title">{getTabTitle(activeTab)}</h2>
        {/* <div className="admin-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${activeTab || 'users'}, projects, logs...`}
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div> */}
      </div>

      <div className="admin-topbar-right">
        <button className="topbar-icon-btn" title="Admin Alerts & Notifications">
          🔔
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}
