import React from 'react';

export default function AdminHeader({ user, searchTerm, setSearchTerm, activeTab }) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'user':
        return '👥 User Directory';
      case 'project':
        return '🚀 Projects';
      case 'department':
        return '🏢 Departments';
      case 'role':
        return '🔑 Roles & Permissions';
      case 'overview':
        return '📊 Executive Overview';
      case 'settings':
        return '⚙️ System Settings';
      default:
        return '👑 Admin Console';
    }
  };

  return (
    <header className="shrink-0 z-50 flex justify-between items-center px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full box-border">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">{getTabTitle(activeTab)}</h2>
      </div>

      <div className="flex items-center gap-5">
        <button className="w-9.5 h-9.5 rounded-xl bg-white border border-slate-300 flex items-center justify-center cursor-pointer relative text-base transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900" title="Admin Alerts & Notifications">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
