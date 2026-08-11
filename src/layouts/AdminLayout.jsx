import React from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import AdminHeader from '../components/layout/AdminHeader';
import AdminFooter from '../components/layout/AdminFooter';

export default function AdminLayout({
  children,
  user,
  onLogout,
  activeTab,
  onTabChange,
  searchTerm,
  setSearchTerm
}) {
  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-ambient-bg">
        <div className="admin-orb admin-orb-1"></div>
        <div className="admin-orb admin-orb-2"></div>
      </div>

      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', minWidth: 0 }}>
        <AdminHeader
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <AdminFooter />
      </div>
    </div>
  );
}
