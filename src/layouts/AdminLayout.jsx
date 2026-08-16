import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout({
  children,
  user,
  onLogout,
  activeTab,
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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'user', label: 'Users', icon: '👥', permission: 'view_user' },
    { id: 'pending-users', label: 'Pending Users', icon: '⏳', permission: 'view_user' },
    { id: 'project', label: 'Projects', icon: '🚀', permission: 'view_project' },
    { id: 'department', label: 'Departments', icon: '🏢', permission: 'view_department' },
    { id: 'designation', label: 'Designations', icon: '🎖️', permission: 'view_designation' }
  ];

  const navItems = navItemsConfig.filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div className="flex flex-col h-screen h-dvh max-h-screen max-h-dvh w-full bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-indigo-200/70 -top-28 -right-24"></div>
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-purple-200/70 -bottom-36 -left-20"></div>
      </div>

      <Header
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        theme="indigo"
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
          theme="indigo"
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarCollapsed(true)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer theme="indigo" />
        </div>
      </div>
    </div>
  );
}
