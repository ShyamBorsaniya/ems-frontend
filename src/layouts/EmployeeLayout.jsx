import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

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
  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: '🏠' },
    { id: 'attendance', label: 'Attendance Log', icon: '⏱️' },
    { id: 'tasks', label: 'My Tasks', icon: '📋', badge: '3' },
    { id: 'leaves', label: 'Leave Portal', icon: '🏖️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'help', label: 'Support Desk', icon: '❓' }
  ];

  return (
    <div className="flex h-screen max-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50 text-slate-900 font-sans relative overflow-hidden">
      <Sidebar
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
        theme="emerald"
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          isPunchedIn={isPunchedIn}
          togglePunchStatus={togglePunchStatus}
          onLogout={onLogout}
          theme="emerald"
        />
        <div className="flex-1">
          {children}
        </div>
        <Footer theme="emerald" />
      </div>
    </div>
  );
}
