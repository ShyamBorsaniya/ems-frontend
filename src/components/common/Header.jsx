import React from 'react';

export default function Header({
  theme = 'indigo', // 'indigo' or 'emerald'
  user,
  searchTerm,
  setSearchTerm,
  activeTab,
  isPunchedIn = true,
  togglePunchStatus,
  onLogout,
  isSidebarCollapsed = false,
  onToggleSidebar
}) {
  const isIndigo = theme === 'indigo';

  const themeStyles = isIndigo
    ? {
        logoBg: 'bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md',
        logoSubtitle: 'Admin Console',
        roleText: 'text-indigo-600',
        logoSvg: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )
      }
    : {
        logoBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20',
        logoSubtitle: 'Employee Portal',
        roleText: 'text-emerald-600',
        logoSvg: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )
      };

  return (
    <header className="shrink-0 z-[40] flex justify-between items-center px-4 sm:px-8 py-[0.85rem] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full box-border">
      <div className="flex items-center gap-5">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer mr-1 flex items-center justify-center border border-slate-200 bg-white shadow-xs focus:outline-none"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarCollapsed ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <path d="M12 9l3 3-3 3"></path>
                </>
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <path d="M15 15l-3-3 3-3"></path>
                </>
              )}
            </svg>
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className={`w-[38px] h-[38px] rounded-xl ${themeStyles.logoBg}`}>
            {themeStyles.logoSvg}
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-[1.15rem] text-slate-900 tracking-tight block leading-tight">WorkPulse EMS</span>
            <span className={`text-[0.7rem] font-semibold uppercase tracking-wider block ${themeStyles.roleText}`}>
              {themeStyles.logoSubtitle}
            </span>
          </div>
        </div>

        {!isIndigo && setSearchTerm && (
          <div className="relative hidden sm:flex items-center ml-4">
            <span className="absolute left-3 text-slate-400 text-xs pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search my tasks, leaves, policies..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60 focus:w-72 py-2 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs transition-all duration-200 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {!isIndigo && togglePunchStatus && (
          <button
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border ${isPunchedIn
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
              }`}
            onClick={togglePunchStatus}
            title={isPunchedIn ? 'Click to Punch Out' : 'Click to Punch In'}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isPunchedIn ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'
                }`}
            ></span>
            <span>{isPunchedIn ? 'Punched In' : 'Punched Out'}</span>
          </button>
        )}

        <button
          className="w-9.5 h-9.5 rounded-xl bg-white border border-slate-300 flex items-center justify-center cursor-pointer relative text-base transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900"
          title={isIndigo ? 'Admin Alerts & Notifications' : 'My Notifications'}
        >
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 border-2 border-white"></span>
        </button>

        {!isIndigo && onLogout && (
          <button
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            onClick={onLogout}
            title="Sign Out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
