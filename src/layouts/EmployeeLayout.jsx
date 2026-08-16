import React, { useState, useEffect } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: '🏠' },
    { id: 'attendance', label: 'Attendance Log', icon: '⏱️' },
    { id: 'tasks', label: 'My Tasks', icon: '📋', badge: '3' },
    { id: 'leaves', label: 'Leave Portal', icon: '🏖️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'help', label: 'Support Desk', icon: '❓' }
  ];

  return (
    <div className="flex flex-col h-screen h-dvh max-h-screen max-h-dvh w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50 text-slate-900 font-sans relative overflow-hidden">
      <Header
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        isPunchedIn={isPunchedIn}
        togglePunchStatus={togglePunchStatus}
        onLogout={onLogout}
        theme="emerald"
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex flex-1 overflow-hidden min-h-0 relative z-10">
        <Sidebar
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
          user={user}
          onLogout={onLogout}
          theme="emerald"
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarCollapsed(true)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer theme="emerald" />
        </div>
      </div>
    </div>
  );
}
