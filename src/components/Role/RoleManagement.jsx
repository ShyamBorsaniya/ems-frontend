import React from 'react';

export default function RoleManagement({ roles, setShowAddRoleModal, triggerToast }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 flex items-center gap-2">🔑 Role Definition & Permission Matrix</span>
        <button
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          onClick={() => setShowAddRoleModal(true)}
        >
          + Define New Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <th className="py-3 px-4">Role Title</th>
              <th className="py-3 px-4">Hierarchy Level</th>
              <th className="py-3 px-4">Assigned Users</th>
              <th className="py-3 px-4">Granted Permissions</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">{r.title}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    {r.level}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">{r.usersCount} Staff Members</td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1.5">
                    {r.permissions.map((perm, idx) => (
                      <span key={idx} className="text-[0.7rem] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-medium transition-colors cursor-pointer"
                    onClick={() => triggerToast(`Configuring matrix for ${r.title}`)}
                  >
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
