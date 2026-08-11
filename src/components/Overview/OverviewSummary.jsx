import React from 'react';

export default function OverviewSummary({
  adminName = 'User',
  employees = [],
  projects = [],
  roles = [],
  triggerToast
}) {
  const inProgressProjectsCount = projects.filter(p => p.status === 'In Progress').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">Welcome, {adminName.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">WorkPulse Management Console — Streamlining users, projects, departments, and roles.</p>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">👥</div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{employees.length} Active</div>
          <div className="text-xs text-slate-400">Across 5 Departments</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg">🚀</div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{projects.length} Initiatives</div>
          <div className="text-xs text-slate-400">{inProgressProjectsCount} In Progress</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-500">Configured Roles</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">🔑</div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">{roles.length} Tiered Roles</div>
          <div className="text-xs text-slate-400">Access Matrix Enforced</div>
        </div>
      </div>

      {/* Executive Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <span className="text-base font-bold text-slate-900">📊 Executive Overview & System Health</span>
        </div>
        <p className="text-slate-600 text-sm">
          All systems operating normally. <strong className="text-slate-900 font-semibold">{employees.length} active users</strong>, <strong className="text-slate-900 font-semibold">{projects.length} projects</strong> running across 5 departments.
        </p>
      </div>
    </div>
  );
}
