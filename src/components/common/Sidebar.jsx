import React from 'react';

export default function Sidebar({
  navItems = [],
  activeTab,
  onTabChange,
  user,
  onLogout,
  theme = 'indigo', // 'indigo' or 'emerald'
  isCollapsed = false,
  onClose
}) {
  const isIndigo = theme === 'indigo';

  const themeStyles = isIndigo
    ? {
        logoBg: 'bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md',
        logoSubtitle: 'Admin Console',
        sectionTitle: 'Admin Navigation',
        activeButton: 'bg-indigo-50/80 text-indigo-600 font-semibold border border-indigo-200/80 shadow-xs',
        inactiveButton: 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-indigo-600',
        badge: 'bg-indigo-100/80 text-indigo-600',
        avatarBorder: 'border-2 border-indigo-600',
        roleText: 'text-indigo-600',
        logoutBtn: 'Admin Logout',
        defaultName: 'Admin',
        bgParam: '4f46e5',
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
        sectionTitle: 'Employee Portal',
        activeButton: 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs',
        inactiveButton: 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-emerald-700',
        badge: 'bg-emerald-100/80 text-emerald-700',
        avatarBorder: 'border-2 border-emerald-500',
        roleText: 'text-emerald-600',
        logoutBtn: 'Logout',
        defaultName: 'Employee',
        bgParam: '10b981',
        logoSvg: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )
      };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || user?.username || themeStyles.defaultName
  )}&background=${themeStyles.bgParam}&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-45 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside className={`bg-white border-r border-slate-200 flex flex-col justify-between h-full z-50 shadow-sm shrink-0 transition-all duration-300 overflow-x-hidden fixed inset-y-0 left-0 md:relative ${
        isCollapsed
          ? '-translate-x-full md:translate-x-0 w-[260px] md:w-[76px] md:min-w-[76px]'
          : 'translate-x-0 w-[260px] min-w-[260px] shadow-2xl md:shadow-none'
      }`}>
        <div className={isCollapsed ? 'p-3' : 'p-6'}>
          {isCollapsed ? (
            <div className="h-px bg-slate-200 my-4" />
          ) : (
            <div className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-4 ml-2 truncate">
              {themeStyles.sectionTitle}
            </div>
          )}

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 w-full cursor-pointer ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3 text-left'
                  } ${isActive ? themeStyles.activeButton : themeStyles.inactiveButton}`}
                  onClick={() => {
                    if (onTabChange) onTabChange(item.id);
                    if (onClose) onClose();
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-base w-6 flex items-center justify-center shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${themeStyles.badge}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`border-t border-slate-200 bg-slate-50/80 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-5'}`}>
          <div className={`flex items-center mb-3 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <img src={avatarUrl} alt="Avatar" className={`w-[38px] h-[38px] rounded-full object-cover shrink-0 ${themeStyles.avatarBorder}`} />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">
                  {user?.name || user?.username || `${themeStyles.defaultName} User`}
                </span>
                <span className={`text-xs font-medium truncate ${themeStyles.roleText}`}>
                  {user?.role_name || user?.role || (isIndigo ? 'Administrator' : 'Staff Member')}
                </span>
              </div>
            )}
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white text-slate-600 border border-slate-200 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            onClick={onLogout}
            title={isCollapsed ? themeStyles.logoutBtn : undefined}
          >
            <span>🚪</span> {!isCollapsed && <span>{themeStyles.logoutBtn}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
