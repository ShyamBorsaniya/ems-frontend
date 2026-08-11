import React from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';

export default function Profile({ user }) {
  const avatarUrl = user?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Employee')}&background=10b981&color=fff`;

  return (
    <EmployeeLayout>
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
            <img src={avatarUrl} alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-md" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">{user?.name || user?.username || 'Employee Profile'}</h2>
              <p className="text-sm text-slate-500 mt-1">{user?.role_name || user?.role || 'Employee'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">EMPLOYEE ID</label>
              <div className="text-base font-semibold text-slate-900 mt-1">{user?.employeeId || `EMP-${user?.id || '104'}`}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">WORK EMAIL</label>
              <div className="text-base font-semibold text-slate-900 mt-1">{user?.email || 'employee@company.com'}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">PHONE NUMBER</label>
              <div className="text-base font-semibold text-slate-900 mt-1">{user?.phone || '+1 (555) 234-5678'}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ACCOUNT STATUS</label>
              <div className="text-base font-semibold text-emerald-600 mt-1">● Active</div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
