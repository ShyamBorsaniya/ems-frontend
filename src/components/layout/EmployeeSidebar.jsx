import React from 'react';

export default function EmployeeSidebar({ activeTab = 'dashboard', onTabChange, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: '🏠' },
    { id: 'attendance', label: 'Attendance Log', icon: '⏱️' },
    { id: 'tasks', label: 'My Tasks', icon: '📋', badge: '3' },
    { id: 'leaves', label: 'Leave Portal', icon: '🏖️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'help', label: 'Support Desk', icon: '❓' }
  ];

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Employee')}&background=10b981&color=fff`;
  const avatarUrl = user?.profile_image || defaultAvatar;

  return (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-slate-200 flex flex-col justify-between h-screen z-[60] shadow-sm shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
          <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <span className="font-bold text-[1.15rem] text-slate-900 tracking-tight block">WorkPulse EMS</span>
            <span className="text-[0.7rem] text-emerald-600 font-semibold uppercase tracking-wider block">Employee Portal</span>
          </div>
        </div>

        <div className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest my-4 ml-2">Employee Portal</div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 shadow-xs'
                    : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-emerald-700'
                }`}
                onClick={() => onTabChange && onTabChange(item.id)}
              >
                <span className="text-base w-6 flex items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-700 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-3 mb-3">
          <img src={avatarUrl} alt="Avatar" className="w-[38px] h-[38px] rounded-full object-cover border-2 border-emerald-500" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">{user?.name || user?.username || 'Employee'}</span>
            <span className="text-xs text-emerald-600 font-medium">{user?.role_name || user?.role || 'Staff Member'}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white text-slate-600 border border-slate-200 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" onClick={onLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
