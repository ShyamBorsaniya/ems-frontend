import React, { useState } from 'react';

export default function Settings({ triggerToast }) {
  const [appName, setAppName] = useState('WorkPulse EMS');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const handleSave = (e) => {
    e.preventDefault();
    if (triggerToast) {
      triggerToast('System settings updated successfully!');
    }
  };

  return (
    <div className="p-6 sm:p-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">System Configuration & Settings</h2>
        <p className="text-slate-500 text-sm mb-8">
          Manage global enterprise platform settings, authentication parameters, and notification channels.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Portal Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Session Inactivity Timeout (Minutes)</label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="120">120 Minutes</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Enable Automated System Email Notifications
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
