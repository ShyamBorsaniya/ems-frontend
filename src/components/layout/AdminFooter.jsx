import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="px-8 py-4 border-t border-slate-200 bg-white text-slate-500 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto z-10">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900">WorkPulse Admin Console</span>
        <span>•</span>
        <span>© {new Date().getFullYear()} Enterprise EMS. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-5 font-medium">
        <span className="cursor-pointer text-indigo-600 hover:underline">Audit Logs</span>
        <span className="cursor-pointer hover:text-slate-900">Security Policies</span>
        <span className="cursor-pointer hover:text-slate-900">Documentation</span>
        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-emerald-200">
          🟢 Region: us-east-1
        </span>
      </div>
    </footer>
  );
}
