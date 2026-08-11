import React from 'react';
import EmployeeSidebar from '../components/layout/EmployeeSidebar';
import EmployeeHeader from '../components/layout/EmployeeHeader';
import EmployeeFooter from '../components/layout/EmployeeFooter';

export default function EmployeeLayout({
  children,
  user,
  onLogout,
  activeTab = 'dashboard',
  onTabChange,
  searchTerm,
  setSearchTerm,
  isPunchedIn,
  togglePunchStatus
}) {
  return (
    <div className="admin-dashboard-wrapper" style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <EmployeeSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', minWidth: 0 }}>
        <EmployeeHeader
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          isPunchedIn={isPunchedIn}
          togglePunchStatus={togglePunchStatus}
          onLogout={onLogout}
        />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <EmployeeFooter />
      </div>
    </div>
  );
}
