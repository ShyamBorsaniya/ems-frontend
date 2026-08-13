import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import RoleFormModal from './RoleFormModal';
import RoleShowModal from './RoleShowModal';
import RoleDeleteModal from './RoleDeleteModal';

export default function RoleManagement({
  roles = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  onRefresh,
  triggerToast,
  setShowAddRoleModal
}) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Local synced roles list
  const [localRoles, setLocalRoles] = useState(Array.isArray(roles) ? roles : []);

  useEffect(() => {
    setLocalRoles(Array.isArray(roles) ? roles : []);
  }, [roles]);

  const rolesList = localRoles;

  // Local search fallback if parent doesn't manage search term
  const [localSearch, setLocalSearch] = useState('');
  const currentSearch = setSearchTerm !== undefined ? searchTerm : localSearch;

  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
  };

  // Helper formatting functions
  const formatRoleTitle = (name) => {
    if (!name) return 'Unassigned Role';
    return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getRoleBadgeStyle = (name) => {
    const r = (name || '').toLowerCase();
    if (r.includes('admin')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (r.includes('hr')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (r.includes('project')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (r.includes('department') || r.includes('manager')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (r.includes('employee') || r.includes('dev')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Callbacks for CRUD actions
  const handleRoleCreated = (newRole) => {
    setLocalRoles((prev) => [newRole, ...prev]);
    if (onRefresh) onRefresh();
  };

  const handleRoleUpdated = (updatedRole) => {
    setLocalRoles((prev) =>
      prev.map((r) => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r))
    );
    if (onRefresh) onRefresh();
  };

  const handleRoleDeleted = (roleId) => {
    setLocalRoles((prev) => prev.filter((r) => r.id !== roleId));
    if (onRefresh) onRefresh();
  };

  // Filtering roles locally if no backend pagination
  const filteredRoles = rolesList.filter((r) => {
    const q = currentSearch.toLowerCase().trim();
    if (!q) return true;
    const name = (r.name || r.title || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const roleType = r.is_system_role ? 'system' : 'custom';
    return name.includes(q) || desc.includes(q) || roleType.includes(q);
  });

  const displayedRoles = paginationInfo ? rolesList : filteredRoles;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Roles Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>🔑</span> Role Definition Directory
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Manage system access roles, titles, and permission scopes.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <input
                type="text"
                placeholder="Search role title, description, system..."
                value={currentSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              {currentSearch && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Define New Role Button */}
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              onClick={() => {
                if (setShowAddRoleModal) setShowAddRoleModal(true);
                else setShowFormModal(true);
              }}
            >
              + Define New Role
            </button>
          </div>
        </div>

        {/* Error Bar */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex justify-between items-center">
            <span>⚠️ API Note: {error}</span>
            {onRefresh && (
              <button onClick={onRefresh} className="underline font-semibold cursor-pointer">
                Retry
              </button>
            )}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Fetching role list from backend API...</span>
          </div>
        ) : displayedRoles.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No roles found</h3>
            <p className="text-xs text-slate-500 m-0">Try clearing or adjusting your search parameters.</p>
            {currentSearch && (
              <button
                onClick={() => handleSearchChange('')}
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          /* Roles Data Table */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Role Title</th>
                    <th className="py-3 px-4">Description & Scope</th>
                    <th className="py-3 px-4 text-center">System Role</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRoles.map((r) => {
                    const title = formatRoleTitle(r.name || r.title);

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Role Title */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setSelectedRole(r)}
                            title="Click to view role details"
                          >
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getRoleBadgeStyle(r.name || r.title)}`}>
                              {title}
                            </span>
                          </div>
                        </td>

                        {/* 2. Description */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">
                          {r.description || 'Standard enterprise role access level'}
                        </td>

                        {/* 3. System Role Status */}
                        <td className="py-3.5 px-4 text-center">
                          {r.is_system_role ? (
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs"
                              title="System Role: Yes"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 border border-rose-300 shadow-xs"
                              title="System Role: No"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          )}
                        </td>

                        {/* 4. Created Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {formatDate(r.created_at)}
                        </td>

                        {/* 5. Actions (View, Edit, Delete) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Role */}
                            <button
                              type="button"
                              title="View Role Details"
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => setSelectedRole(r)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit Role */}
                            <button
                              type="button"
                              title="Edit Role Definition"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => setEditingRole(r)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Delete Role */}
                            <button
                              type="button"
                              title="Delete Role"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => setDeletingRole(r)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <Pagination
              pagination={paginationInfo}
              currentPage={currentPage}
              totalItems={displayedRoles.length}
              onPageChange={onPageChange}
              className="-mx-6 -mb-6 mt-4 rounded-b-2xl border-t border-slate-200"
            />
          </>
        )}
      </div>

      {/* Modals */}

      {/* 1. Add / Create Role Modal */}
      {showFormModal && (
        <RoleFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onRoleCreated={handleRoleCreated}
          triggerToast={triggerToast}
        />
      )}

      {/* 2. View / Show Role Modal */}
      {selectedRole && (
        <RoleShowModal
          role={selectedRole}
          isOpen={Boolean(selectedRole)}
          onClose={() => setSelectedRole(null)}
          onEditRole={(r) => setEditingRole(r)}
          onDeleteRole={(r) => setDeletingRole(r)}
        />
      )}

      {/* 3. Edit Role Modal */}
      {editingRole && (
        <RoleFormModal
          role={editingRole}
          isOpen={Boolean(editingRole)}
          onClose={() => setEditingRole(null)}
          onRoleUpdated={handleRoleUpdated}
          triggerToast={triggerToast}
        />
      )}

      {/* 4. Delete Role Modal */}
      {deletingRole && (
        <RoleDeleteModal
          role={deletingRole}
          isOpen={Boolean(deletingRole)}
          onClose={() => setDeletingRole(null)}
          onRoleDeleted={handleRoleDeleted}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
