import React from 'react';

export default function DepartmentManagement() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 flex items-center gap-2">🏢 Department Structure & Allocation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-900 text-sm">💻 Engineering & Product</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-600 font-semibold">2 Headcount</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Lead: Sarah Connor</p>
          <div className="text-xs font-semibold text-emerald-600">● 100% Present Today</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-900 text-sm">📈 Sales & Business Dev</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-600 font-semibold">2 Headcount</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Lead: Jim Halpert</p>
          <div className="text-xs font-semibold text-amber-600">● 1 On Leave / 1 Present</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-900 text-sm">🤝 Human Resources</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-600 font-semibold">1 Headcount</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Lead: Pam Beesly</p>
          <div className="text-xs font-semibold text-sky-600">● 1 Remote Active</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-slate-900 text-sm">💰 Finance & Accounting</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-600 font-semibold">1 Headcount</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Lead: Angela Martin</p>
          <div className="text-xs font-semibold text-emerald-600">● 100% Present Today</div>
        </div>
      </div>
    </div>
  );
}
