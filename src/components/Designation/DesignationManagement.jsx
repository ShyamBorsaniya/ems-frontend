import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import DesignationFormModal from './DesignationFormModal';
import DesignationShowModal from './DesignationShowModal';
import Swal from 'sweetalert2';
import { deleteDesignationApi } from '../../api/admin/designationApi';
import { useAuth } from '../../hooks/useAuth';
import FilterDropdown from '../common/FilterDropdown';


export default function DesignationManagement({
  designations = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  onRefresh,
  triggerToast
}) {
  const { hasPermission } = useAuth();
  const [selectedDesg, setSelectedDesg] = useState(null);
  const [editingDesg, setEditingDesg] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Local synced designations list
  const [localDesignations, setLocalDesignations] = useState(Array.isArray(designations) ? designations : []);

  const handleDesignationCreated = (newDesg) => {
    setLocalDesignations((prev) => [newDesg, ...prev]);
    if (onRefresh) onRefresh();
  };

  const handleDesignationUpdated = (updatedDesg) => {
    setLocalDesignations((prev) =>
      prev.map((d) => (d.id === updatedDesg.id ? { ...d, ...updatedDesg } : d))
    );
    if (onRefresh) onRefresh();
  };

  const handleDesignationDeleted = (desgId) => {
    setLocalDesignations((prev) => prev.filter((d) => d.id !== desgId));
    if (onRefresh) onRefresh();
  };

  const handleDeleteClick = (desg) => {
    Swal.fire({
      title: 'Confirm Delete Designation',
      html: `
        <div class="text-left text-xs text-slate-600">
          <p class="mb-2 font-medium text-slate-700">Are you sure you want to permanently delete this designation?</p>
          <p class="mb-2">Designation: <strong>${desg.name}</strong> (ID: #${desg.id})</p>
          <ul class="pl-4 list-disc text-slate-500 flex flex-col gap-1">
            <li>This action cannot be undone.</li>
            <li>Users assigned to this designation might need to be reassigned.</li>
          </ul>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Designation',
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
          const res = await deleteDesignationApi(desg.id);
          if (res && res.success === false) {
            throw new Error(res.message || 'Failed to delete designation');
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
          triggerToast(`Designation "${desg.name}" deleted successfully!`);
        }
        handleDesignationDeleted(desg.id);
      }
    });
  };

  useEffect(() => {
    setLocalDesignations(Array.isArray(designations) ? designations : []);
  }, [designations]);

  const designationsList = localDesignations;

  // Local search fallback if parent doesn't manage search term
  const [localSearch, setLocalSearch] = useState('');
  
  const currentSearch = setSearchTerm !== undefined ? searchTerm : localSearch;

  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
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

  // Local fallback filtering if no backend pagination
  const filteredDesignations = designationsList.filter((d) => {
    const q = currentSearch.toLowerCase().trim();
    if (q) {
      const name = (d.name || '').toLowerCase();
      const code = (d.code || '').toLowerCase();
      const deptName = (d.department?.name || '').toLowerCase();
      const compName = (d.company_name || '').toLowerCase();
      const matches = name.includes(q) || code.includes(q) || deptName.includes(q) || compName.includes(q);
      if (!matches) return false;
    }



    return true;
  });

  const displayedDesignations = filteredDesignations;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Designations Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>🎖️</span> Designation Directory
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">View system employee job titles, codes, and department mappings.</p>
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
                  placeholder: 'Search name, code, dept...',
                  defaultValue: ''
                }
              ]}
            />

            {/* Create Designation Button */}
            {hasPermission('add_designation') && (
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => setShowFormModal(true)}
              >
                + Create Designation
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
            <span className="text-xs font-semibold">Fetching designation list from backend API...</span>
          </div>
        ) : displayedDesignations.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No designations found</h3>
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
          /* Designations Data Table */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4 w-20 hidden sm:table-cell">ID</th>
                    <th className="py-3 px-4">Designation Name</th>
                    <th className="py-3 px-4 hidden md:table-cell">Code</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Created Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedDesignations.map((d) => {
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. ID */}
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500 hidden sm:table-cell">
                          #{d.id}
                        </td>

                        {/* 2. Designation Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setSelectedDesg(d)}
                            title="Click to view designation details"
                          >
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              🎖️
                            </span>
                            <span className="group-hover:text-indigo-600 transition-colors">{d.name || 'N/A'}</span>
                          </div>
                        </td>

                        {/* 3. Code */}
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-xs hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {d.code || 'N/A'}
                          </span>
                        </td>

                        {/* 4. Department */}
                        <td className="py-3.5 px-4 text-slate-700">
                          {d.department ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-850">{d.department.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{d.department.code}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No Department</span>
                          )}
                        </td>

                        {/* 5. Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                            d.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                              : 'bg-rose-50 text-rose-700 border-rose-250'
                          }`}>
                            {d.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* 7. Created Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs hidden lg:table-cell">
                          {formatDate(d.created_at)}
                        </td>

                        {/* Actions (View, Edit, Delete) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Designation */}
                            <button
                              type="button"
                              title="View Designation Details"
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => setSelectedDesg(d)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit Designation */}
                            {hasPermission('change_designation') && (
                              <button
                                type="button"
                                title="Edit Designation"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition-colors cursor-pointer flex items-center justify-center"
                                onClick={() => setEditingDesg(d)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}

                            {/* Delete Designation */}
                            {hasPermission('delete_designation') && (
                              <button
                                type="button"
                                title="Delete Designation"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
                                onClick={() => handleDeleteClick(d)}
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
              totalItems={displayedDesignations.length}
              onPageChange={onPageChange}
              className="-mx-6 -mb-6 mt-4 rounded-b-2xl border-t border-slate-200"
            />
          </>
        )}
      </div>

      {/* Create Designation Modal */}
      {showFormModal && (
        <DesignationFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onDesignationCreated={handleDesignationCreated}
          triggerToast={triggerToast}
        />
      )}

      {/* View Designation Modal */}
      {selectedDesg && (
        <DesignationShowModal
          designation={selectedDesg}
          isOpen={Boolean(selectedDesg)}
          onClose={() => setSelectedDesg(null)}
          onEditDesignation={(desg) => setEditingDesg(desg)}
          onDeleteDesignation={(desg) => handleDeleteClick(desg)}
        />
      )}

      {/* Edit Designation Modal */}
      {editingDesg && (
        <DesignationFormModal
          designation={editingDesg}
          isOpen={Boolean(editingDesg)}
          onClose={() => setEditingDesg(null)}
          onDesignationUpdated={handleDesignationUpdated}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
