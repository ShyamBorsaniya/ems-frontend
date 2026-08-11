import React from 'react';

export default function ProjectManagement({ projects, setShowAddProjModal }) {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Testing':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 flex items-center gap-2">🚀 Enterprise Projects & Delivery Status</span>
        <button
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          onClick={() => setShowAddProjModal(true)}
        >
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(proj => (
          <div key={proj.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-slate-900 text-base">{proj.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">Lead: {proj.lead} ({proj.dept})</div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(proj.status)}`}>
                {proj.status}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>Progress Completion</span>
                <span className="font-semibold text-slate-900">{proj.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-xs border-t border-slate-200 pt-3 text-slate-500">
              <span>Deadline: {proj.deadline}</span>
              <span className="color-indigo-600 font-semibold text-indigo-600">Budget: {proj.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
