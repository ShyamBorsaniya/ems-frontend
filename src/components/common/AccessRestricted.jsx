import React from 'react';

export default function AccessRestricted({
  title = 'Access Restricted',
  message = 'You do not have permission to access this page. Please contact your system administrator if you believe this is an error.',
  onReturn,
  buttonText = 'Return to Dashboard'
}) {
  return (
    <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-2xl animate-cardFadeUp flex flex-col items-center gap-5">
      <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-250 text-rose-600 flex items-center justify-center text-3xl shadow-sm">
        🔒
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {message}
        </p>
      </div>
      {onReturn && (
        <button
          type="button"
          onClick={onReturn}
          className="w-full mt-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>📊</span> {buttonText}
        </button>
      )}
    </div>
  );
}
