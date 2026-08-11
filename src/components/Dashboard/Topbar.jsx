import React from 'react';

export default function Topbar({ activeTab, searchTerm, setSearchTerm }) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'user':
        return '👥 User Management Portal';
      case 'project':
        return '🚀 Active Projects & Delivery';
      case 'department':
        return '🏢 Department Operations & Structure';
      case 'role':
        return '🔑 Role & Permission Matrix';
      case 'overview':
        return '📊 Executive Dashboard Summary';
      default:
        return '👥 User Management Portal';
    }
  };

  return (
    <header className="admin-navbar">
      <div className="admin-nav-title">
        {getTabTitle(activeTab)}
        <span className="admin-role-badge">Console</span>
      </div>

      <div className="admin-nav-controls">
        {/* Quick Search Bar */}
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search staff, roles, projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
