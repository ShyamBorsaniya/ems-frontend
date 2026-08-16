import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import { useAuth } from '../../hooks/useAuth';
import FilterDropdown from '../common/FilterDropdown';

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
  setShowAddRoleModal
}) {
  const { hasPermission } = useAuth();
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
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Filtering roles locally if no backend pagination
  const filteredRoles = rolesList.filter((r) => {
    const q = currentSearch.toLowerCase().trim();
    if (q) {
      const name = (r.name || '').toLowerCase();
      const displayName = (r.display_name || '').toLowerCase();
      const id = String(r.id || '');
      const matches = name.includes(q) || displayName.includes(q) || id.includes(q);
      if (!matches) return false;
    }



    return true;
  });

  const displayedRoles = filteredRoles;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Roles Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>🔑</span> Role Directory
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">View system access roles and permission levels.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <FilterDropdown
              value={{
                search: currentSearch
              }}
              onApply={(filters) => {
                handleSearchChange(filters.search || '');
              }}
              config={[
                {
                  id: 'search',
                  label: 'Keyword search',
                  type: 'text',
                  placeholder: 'Search role name...',
                  defaultValue: ''
                }
              ]}
            />

            {/* Add Role Button */}
            {setShowAddRoleModal && hasPermission('add_role') && (
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-650/20 transition-all cursor-pointer"
                onClick={() => setShowAddRoleModal(true)}
              >
                + Define Role
              </button>
            )}
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
                    <th className="py-3 px-4 w-20 hidden sm:table-cell">ID</th>
                    <th className="py-3 px-4">Display Name</th>
                    <th className="py-3 px-4">Role Name</th>
                    <th className="py-3 px-4 hidden md:table-cell">Created Date</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Updated Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRoles.map((r) => {
                    const displayName = r.display_name || formatRoleTitle(r.name);

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. ID */}
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500 hidden sm:table-cell">
                          #{r.id}
                        </td>

                        {/* 2. Display Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getRoleBadgeStyle(r.display_name || r.name)}`}>
                            {displayName}
                          </span>
                        </td>

                        {/* 3. Role Name */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                          {r.name || 'N/A'}
                        </td>

                        {/* 4. Created Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs hidden md:table-cell">
                          {formatDate(r.created_at)}
                        </td>

                        {/* 5. Updated Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs hidden lg:table-cell">
                          {formatDate(r.updated_at)}
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
    </div>
  );
}



