import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';

export default function EmployeeLayout({
  children,
  user,
  onLogout,
  activeTab = 'dashboard',
  onTabChange,
  searchTerm,
  setSearchTerm
}) {
  const { hasPermission } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItemsConfig = [
    { id: 'dashboard', label: 'My Dashboard', icon: '🏠' },
    { id: 'user', label: 'Users', icon: '👥', permission: 'user:view' },
    { id: 'project', label: 'Projects', icon: '🚀', permission: 'project:view' }
  ];

  const navItems = navItemsConfig.filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div className="flex flex-col h-screen h-dvh max-h-screen max-h-dvh w-full bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50 text-slate-900 font-sans relative overflow-hidden">
      <Header
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        onLogout={onLogout}
        onTabChange={onTabChange}
        theme="emerald"
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex flex-1 overflow-hidden min-h-0 relative">
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
