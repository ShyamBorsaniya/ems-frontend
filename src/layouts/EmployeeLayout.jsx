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
    <div className="flex h-screen max-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50 text-slate-900 font-sans relative overflow-hidden">
      <EmployeeSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 z-10">
        <EmployeeHeader
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          isPunchedIn={isPunchedIn}
          togglePunchStatus={togglePunchStatus}
          onLogout={onLogout}
        />
        <div className="flex-1">
          {children}
        </div>
        <EmployeeFooter />
      </div>
    </div>
  );
}
