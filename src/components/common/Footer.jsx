import React from 'react';

export default function Footer({ theme = 'indigo' }) {
  const isIndigo = theme === 'indigo';

  return (
    <footer className="px-4 sm:px-8 py-4 border-t border-slate-200 bg-white text-slate-500 text-[11px] sm:text-xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto z-10 w-full box-border">
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
        <span className="font-semibold text-slate-900">
          {isIndigo ? 'WorkPulse Admin Console' : 'WorkPulse Employee Portal'}
        </span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span>
          © {new Date().getFullYear()} {isIndigo ? 'Enterprise EMS' : 'Self-Service Desk'}. All rights reserved.
        </span>
      </div>

      {isIndigo ? (
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="cursor-pointer hover:text-slate-900">Security Policies</span>
          <span className="cursor-pointer hover:text-slate-900">Documentation</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 font-medium">
          <span className="cursor-pointer text-emerald-600 hover:underline">Employee Handbook</span>
          <span className="cursor-pointer hover:text-slate-900">IT Support Desk</span>
          <span className="cursor-pointer hover:text-slate-900">HR Policies</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold border border-emerald-200">
            🟢 HR System Active
          </span>
        </div>
      )}
    </footer>
  );
}
