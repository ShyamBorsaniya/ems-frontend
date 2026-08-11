import React from 'react';

export default function Loader({ fullScreen = true, message = 'Loading WorkPulse EMS...' }) {
  if (fullScreen) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-slate-50 text-slate-600 font-sans gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <div className="font-semibold text-sm">{message}</div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>{message}</span>
    </div>
  );
}
