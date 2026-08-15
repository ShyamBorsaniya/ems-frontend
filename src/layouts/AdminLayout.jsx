import React from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function AdminLayout({
  children,
  user,
  onLogout,
  activeTab,
  onTabChange,
  searchTerm,
  setSearchTerm
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'user', label: 'Users', icon: '👥' },
    { id: 'pending-users', label: 'Pending Users', icon: '⏳' },
    { id: 'project', label: 'Projects', icon: '🚀' },
    { id: 'department', label: 'Departments', icon: '🏢' },
    { id: 'role', label: 'Roles', icon: '🔑' },
    { id: 'designation', label: 'Designations', icon: '🎖️' }
  ];

  return (
    <div className="flex h-screen max-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-indigo-200/70 -top-28 -right-24"></div>
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-purple-200/70 -bottom-36 -left-20"></div>
      </div>

      <Sidebar
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
        theme="indigo"
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          theme="indigo"
        />
        <div className="flex-1">
          {children}
        </div>
        <Footer theme="indigo" />
      </div>
    </div>
  );
}
