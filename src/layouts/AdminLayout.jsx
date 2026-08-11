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
    <div className="flex h-screen max-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-indigo-200/70 -top-28 -right-24"></div>
        <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-purple-200/70 -bottom-36 -left-20"></div>
      </div>

      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <AdminHeader
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />
        <div className="flex-1">
          {children}
        </div>
        <AdminFooter />
      </div>
    </div>
  );
}
