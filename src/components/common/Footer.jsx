import React from 'react';

export default function Footer({ theme = 'indigo' }) {
  const isIndigo = theme === 'indigo';

  return (
    <footer className="px-8 py-4 border-t border-slate-200 bg-white text-slate-500 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto z-10">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900">
          {isIndigo ? 'WorkPulse Admin Console' : 'WorkPulse Employee Portal'}
        </span>
        <span>•</span>
        <span>
          © {new Date().getFullYear()} {isIndigo ? 'Enterprise EMS' : 'Self-Service Desk'}. All rights reserved.
        </span>
      </div>

      {isIndigo ? (
        <div className="flex items-center gap-5">
          <span className="cursor-pointer hover:text-slate-900">Security Policies</span>
          <span className="cursor-pointer hover:text-slate-900">Documentation</span>
        </div>
      ) : (
        <div className="flex items-center gap-5 font-medium">
          <span className="cursor-pointer text-emerald-600 hover:underline">Employee Handbook</span>
          <span className="cursor-pointer hover:text-slate-900">IT Support Desk</span>
          <span className="cursor-pointer hover:text-slate-900">HR Policies</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-emerald-200">
            🟢 HR System Active
          </span>
        </div>
      )}
    </footer>
  );
}
