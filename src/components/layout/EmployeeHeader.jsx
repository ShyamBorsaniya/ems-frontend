import React from 'react';

export default function EmployeeHeader({
  user,
  searchTerm,
  setSearchTerm,
  activeTab,
  isPunchedIn = true,
  togglePunchStatus,
  onLogout
}) {
  return (
    <header className="flex justify-between items-center px-8 py-[0.85rem] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full box-border shrink-0 z-50">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-xs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <span className="font-bold text-[1.1rem] text-slate-900 block leading-tight">Employee Portal</span>
            <span className="text-[0.72rem] text-emerald-600 font-semibold block">Self-Service Desk</span>
          </div>
        </div>

        {setSearchTerm && (
          <div className="relative flex items-center ml-4">
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
        {togglePunchStatus && (
          <button
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border ${
              isPunchedIn
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            }`}
            onClick={togglePunchStatus}
            title={isPunchedIn ? "Click to Punch Out" : "Click to Punch In"}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${isPunchedIn ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'}`}></span>
            <span>{isPunchedIn ? 'Punched In' : 'Punched Out'}</span>
          </button>
        )}

        <button className="w-9.5 h-9.5 rounded-xl bg-white border border-slate-300 flex items-center justify-center cursor-pointer relative text-base transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900" title="My Notifications">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 border-2 border-white"></span>
        </button>

        {onLogout && (
          <button
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
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
