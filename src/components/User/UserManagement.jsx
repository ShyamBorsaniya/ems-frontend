import React from 'react';

export default function UserManagement({
  filteredEmployees,
  deptFilter,
  setDeptFilter,
  triggerToast,
  setShowAddUserModal
}) {
  const getBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'remote':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'on leave':
      case 'leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <span className="text-lg font-bold text-slate-900 flex items-center gap-2">👥 User Roster & Staff Directory</span>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Department Filter:</span>
            <select
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {setShowAddUserModal && (
            <button
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              onClick={() => setShowAddUserModal(true)}
            >
              + Onboard User
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Role & Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Attendance Status</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{emp.name}</span>
                      <span className="text-xs text-slate-400">{emp.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 font-medium">{emp.role}</td>
                <td className="py-3.5 px-4 text-slate-700">{emp.department}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(emp.status)}`}>
                    ● {emp.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs font-semibold ${emp.accountStatus === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {emp.accountStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                    onClick={() => triggerToast(`Viewing profile for ${emp.name}`)}
                  >
                    View Details
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
