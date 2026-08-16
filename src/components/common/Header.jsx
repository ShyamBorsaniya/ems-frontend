import React, { useState, useRef, useEffect } from 'react';

export default function Header({
  theme = 'indigo', // 'indigo' or 'emerald'
  user,
  searchTerm,
  setSearchTerm,
  activeTab,
  isPunchedIn = true,
  togglePunchStatus,
  onLogout,
  onTabChange,
  isSidebarCollapsed = false,
  onToggleSidebar
}) {
  const isIndigo = theme === 'indigo';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || user?.username || (isIndigo ? 'Admin' : 'Employee')
  )}&background=${isIndigo ? '4f46e5' : '10b981'}&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;
  const userName = user?.name || user?.username || (isIndigo ? 'Alex Admin' : 'Staff Employee');
  const userRole = user?.role_name || user?.role || (isIndigo ? 'Administrator' : 'Staff Member');

  const themeStyles = isIndigo
    ? {
        logoBg: 'bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md',
        logoSubtitle: 'Admin Console',
        roleText: 'text-indigo-600',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        avatarBorder: 'border-2 border-indigo-600/80 shadow-xs',
        logoSvg: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatarBorder: 'border-2 border-emerald-500/80 shadow-xs',
        logoSvg: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )
      };

  return (
    <header className="shrink-0 z-[40] flex justify-between items-center px-4 sm:px-8 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full box-border">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer mr-1 flex items-center justify-center border border-slate-200 bg-white shadow-xs focus:outline-none"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        <div className="flex items-center gap-2.5">
          <div className={`w-[34px] h-[34px] rounded-xl ${themeStyles.logoBg}`}>
            {themeStyles.logoSvg}
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-base text-slate-900 tracking-tight block leading-tight">WorkPulse EMS</span>
            <span className={`text-[0.65rem] font-semibold uppercase tracking-wider block ${themeStyles.roleText}`}>
              {themeStyles.logoSubtitle}
            </span>
          </div>
        </div>

        {!isIndigo && setSearchTerm && (
          <div className="relative hidden sm:flex items-center ml-3">
            <span className="absolute left-3 text-slate-400 text-xs pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search my tasks, leaves, policies..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 focus:w-64 py-1.5 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs transition-all duration-200 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isIndigo && togglePunchStatus && (
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border ${
              isPunchedIn
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            }`}
            onClick={togglePunchStatus}
            title={isPunchedIn ? 'Click to Punch Out' : 'Click to Punch In'}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isPunchedIn ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'
              }`}
            ></span>
            <span>{isPunchedIn ? 'Punched In' : 'Punched Out'}</span>
          </button>
        )}

        {/* User Profile Avatar Circle Button & Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`p-0.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none hover:ring-2 hover:ring-indigo-400/50 ${
              isProfileOpen ? 'ring-2 ring-indigo-600' : ''
            }`}
            title="User Profile Menu"
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 ${themeStyles.avatarBorder}`}
            />
          </button>

          {/* Floating Dropdown Card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 z-50 animate-fadeIn p-2">
              {/* Header Profile Info Card */}
              <div className="p-3 bg-slate-50/80 rounded-xl mb-1 flex items-center gap-3 border border-slate-100">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className={`w-10 h-10 rounded-full object-cover shrink-0 ${themeStyles.avatarBorder}`}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {userName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">
                    {user?.email || 'user@workpulse.com'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 inline-block ${themeStyles.roleText}`}>
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="py-1 flex flex-col gap-0.5">
                {/* Notifications Option */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      🔔
                    </span>
                    <span>Notifications</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-600">
                    3 New
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onTabChange) onTabChange('profile');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all cursor-pointer group"
                >
                  <span className="text-sm p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    👤
                  </span>
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onTabChange) onTabChange('company');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50/80 hover:text-indigo-600 transition-all cursor-pointer group"
                >
                  <span className="text-sm p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    🏢
                  </span>
                  <span>Company Profile</span>
                </button>
              </div>

              <div className="my-1 border-t border-slate-200/80" />

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer group"
              >
                <span className="text-sm p-1.5 rounded-lg bg-rose-100/60 text-rose-600 group-hover:bg-rose-100 transition-colors">
                  🚪
                </span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
