import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import DepartmentFormModal from './DepartmentFormModal';
import DepartmentShowModal from './DepartmentShowModal';
import Swal from 'sweetalert2';
import { deleteDepartmentApi } from '../../api/admin/departmentApi';
import { useAuth } from '../../hooks/useAuth';
import FilterDropdown from '../common/FilterDropdown';
import Skeleton from '../common/Skeleton';


export default function DepartmentManagement({
  departments = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  isActiveFilter = 'all',
  setIsActiveFilter,
  onRefresh,
  triggerToast,
  setShowAddDeptModal
}) {
  const { hasPermission } = useAuth();
  const [selectedDept, setSelectedDept] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Local synced departments list
  const [localDepts, setLocalDepts] = useState(Array.isArray(departments) ? departments : []);

  useEffect(() => {
    setLocalDepts(Array.isArray(departments) ? departments : []);
  }, [departments]);

  const deptsList = localDepts;

  // Local fallback filters if parent doesn't manage search / status
  const [localSearch, setLocalSearch] = useState('');
  const [localStatus, setLocalStatus] = useState('all');

  const currentSearch = setSearchTerm !== undefined ? searchTerm : localSearch;
  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
  };

  const currentStatus = setIsActiveFilter !== undefined ? isActiveFilter : localStatus;
  const handleStatusChange = (val) => {
    if (setIsActiveFilter) setIsActiveFilter(val);
    else setLocalStatus(val);
  };

  // Helper formatting functions
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
  const handleDeptCreated = (newDept) => {
    setLocalDepts((prev) => [newDept, ...prev]);
    if (onRefresh) onRefresh();
  };

  const handleDeptUpdated = (updatedDept) => {
    setLocalDepts((prev) =>
      prev.map((d) => (d.id === updatedDept.id ? { ...d, ...updatedDept } : d))
    );
    if (onRefresh) onRefresh();
  };

  const handleDeptDeleted = (deptId) => {
    setLocalDepts((prev) => prev.filter((d) => d.id !== deptId));
    if (onRefresh) onRefresh();
  };

  const handleDeleteClick = (dept) => {
    Swal.fire({
      title: 'Confirm Delete Department',
      html: `
        <div class="text-left text-xs text-slate-600">
          <p class="mb-2 font-medium text-slate-700">Are you sure you want to permanently delete this department?</p>
          <p class="mb-2">Department: <strong>${dept.name}</strong> (ID: #${dept.id})</p>
          <ul class="pl-4 list-disc text-slate-500 flex flex-col gap-1">
            <li>This action cannot be undone.</li>
            <li>Users assigned to this department might need to be reassigned.</li>
          </ul>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Department',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900 bg-white',
        title: 'text-base font-bold text-slate-900 m-0',
        htmlContainer: 'mt-3 mb-5',
        actions: 'flex gap-3 justify-end w-full mt-4',
        confirmButton: 'px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2',
        cancelButton: 'px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer'
      },
      buttonsStyling: false,
      preConfirm: async () => {
        try {
          const res = await deleteDepartmentApi(dept.id);
          if (res && res.success === false) {
            throw new Error(res.message || 'Failed to delete department');
          }
          return res;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        if (triggerToast) {
          triggerToast(`Department "${dept.name}" deleted successfully!`);
        }
        handleDeptDeleted(dept.id);
      }
    });
  };

  // Client-side filtering as fallback if no backend pagination active
  const filteredDepts = deptsList.filter((d) => {
    // 1. Search query filter
    const q = currentSearch.toLowerCase().trim();
    if (q) {
      const name = (d.name || '').toLowerCase();
      const desc = (d.description || '').toLowerCase();
      const company = (d.company_name || '').toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !company.includes(q)) {
        return false;
      }
    }

    // 2. Status filter
    if (currentStatus && currentStatus !== 'all' && currentStatus !== 'All') {
      const activeBool = currentStatus === 'true' || currentStatus === true;
      if (d.is_active !== activeBool) {
        return false;
      }
    }



    return true;
  });

  const displayedDepts = filteredDepts;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Department Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>🏢</span> Department Management Directory
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">Manage organizational units, department scopes, and active statuses.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <FilterDropdown
              value={{
                search: currentSearch,
                status: currentStatus
              }}
              onApply={(filters) => {
                handleSearchChange(filters.search || '');
                handleStatusChange(filters.status || 'all');
              }}
              config={[
                {
                  id: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'true', label: 'Active', bullet: 'bg-emerald-500' },
                    { value: 'false', label: 'Inactive', bullet: 'bg-slate-400' }
                  ],
                  defaultValue: 'all'
                },
                {
                  id: 'search',
                  label: 'Keyword search',
                  type: 'text',
                  placeholder: 'Search department name...',
                  defaultValue: ''
                }
              ]}
            />

            {/* Create Department Button */}
            {hasPermission('department:create') && (
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => {
                  if (setShowAddDeptModal) setShowAddDeptModal(true);
                  else setShowFormModal(true);
                }}
              >
                + Create Department
              </button>
            )}
          </div>
        </div>

        {/* Error Alert Bar */}
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

        {/* Loading Skeleton */}
        {loading ? (
          <Skeleton.Table
            rows={4}
            columns={[
              { type: 'avatar-text', className: 'py-3 px-4 w-[250px]' },
              { type: 'text', className: 'py-3 px-4 hidden sm:table-cell' },
              { type: 'text', className: 'py-3 px-4 hidden md:table-cell' },
              { type: 'pill', className: 'py-3 px-4' },
              { type: 'text', className: 'py-3 px-4 hidden lg:table-cell' },
              { type: 'actions', className: 'py-3 px-4 text-center w-[100px]' }
            ]}
          />
        ) : displayedDepts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No departments found</h3>
            <p className="text-xs text-slate-500 m-0">Try clearing or adjusting your search parameters.</p>
            {(currentSearch || currentStatus !== 'all') && (
              <button
                onClick={() => {
                  handleSearchChange('');
                  handleStatusChange('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold cursor-pointer"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        ) : (
          /* Department Data Table */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4">Department Name</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Organization</th>
                    <th className="py-3 px-4 hidden md:table-cell">Scope & Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Created Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedDepts.map((dept) => {
                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Department Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setSelectedDept(dept)}
                            title="Click to view department details"
                          >
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              🏢
                            </span>
                            <span className="group-hover:text-indigo-600 transition-colors">{dept.name}</span>
                          </div>
                        </td>

                        {/* 2. Organization / Company */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium hidden sm:table-cell">
                          {dept.company_name || `Company #${dept.company}`}
                        </td>

                        {/* 3. Description */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate hidden md:table-cell">
                          {dept.description || 'Standard enterprise department'}
                        </td>

                        {/* 4. Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              dept.is_active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span className={dept.is_active ? 'text-emerald-500' : 'text-slate-400'}>●</span>
                            {dept.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* 5. Created Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs hidden lg:table-cell">
                          {formatDate(dept.created_at)}
                        </td>

                        {/* 6. Actions (View, Edit, Delete) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Department */}
                            <button
                              type="button"
                              title="View Department Details"
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => setSelectedDept(dept)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit Department */}
                            {hasPermission('department:edit') && (
                              <button
                                type="button"
                                title="Edit Department"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition-colors cursor-pointer flex items-center justify-center"
                                onClick={() => setEditingDept(dept)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}

                            {/* Delete Department */}
                            {hasPermission('department:delete') && (
                              <button
                                type="button"
                                title="Delete Department"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
                                onClick={() => handleDeleteClick(dept)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
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
              totalItems={displayedDepts.length}
              onPageChange={onPageChange}
              className="-mx-6 -mb-6 mt-4 rounded-b-2xl border-t border-slate-200"
            />
          </>
        )}
      </div>

      {/* Modals */}

      {/* 1. Add / Create Department Modal */}
      {showFormModal && (
        <DepartmentFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onDepartmentCreated={handleDeptCreated}
          triggerToast={triggerToast}
        />
      )}

      {/* 2. View / Show Department Modal */}
      {selectedDept && (
        <DepartmentShowModal
          department={selectedDept}
          isOpen={Boolean(selectedDept)}
          onClose={() => setSelectedDept(null)}
          onEditDepartment={(dept) => setEditingDept(dept)}
          onDeleteDepartment={(dept) => handleDeleteClick(dept)}
        />
      )}

      {/* 3. Edit Department Modal */}
      {editingDept && (
        <DepartmentFormModal
          department={editingDept}
          isOpen={Boolean(editingDept)}
          onClose={() => setEditingDept(null)}
          onDepartmentUpdated={handleDeptUpdated}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
