import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import ProjectFormModal from './ProjectFormModal';
import ProjectShowModal from './ProjectShowModal';
import Swal from 'sweetalert2';
import { deleteProjectApi } from '../../api/admin/projectApi';
import { useAuth } from '../../hooks/useAuth';
import FilterDropdown from '../common/FilterDropdown';


export default function ProjectManagement({
  projects = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  statusFilter = 'all',
  setStatusFilter,
  priorityFilter = 'all',
  setPriorityFilter,
  deptFilter = 'all',
  setDeptFilter,
  departments = [],
  employees = [],
  onRefresh,
  triggerToast,
  setShowAddProjModal
}) {
  const { hasPermission } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Local synced projects list
  const [localProjects, setLocalProjects] = useState(Array.isArray(projects) ? projects : []);

  useEffect(() => {
    setLocalProjects(Array.isArray(projects) ? projects : []);
  }, [projects]);

  const projectsList = localProjects;

  // Local fallback filters if parent doesn't manage search / status
  const [localSearch, setLocalSearch] = useState('');
  const [localStatus, setLocalStatus] = useState('all');
  const [localPriority, setLocalPriority] = useState('all');

  const currentSearch = setSearchTerm !== undefined ? searchTerm : localSearch;
  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
  };

  const currentStatus = setStatusFilter !== undefined ? statusFilter : localStatus;
  const handleStatusChange = (val) => {
    if (setStatusFilter) setStatusFilter(val);
    else setLocalStatus(val);
  };

  const currentPriority = setPriorityFilter !== undefined ? priorityFilter : localPriority;
  const handlePriorityChange = (val) => {
    if (setPriorityFilter) setPriorityFilter(val);
    else setLocalPriority(val);
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

  const normalizeStatus = (s) => (s || '').toString().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

  const getBadgeStyle = (status) => {
    const key = normalizeStatus(status);
    switch (key) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ACTIVE':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PLANNED':
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const normalizePriority = (p) => (p || '').toString().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

  const getPriorityBadgeStyle = (priority) => {
    const key = normalizePriority(priority);
    switch (key) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getProgressPercentage = (proj) => {
    if (proj.progress !== undefined && proj.progress !== null) return proj.progress;
    const key = normalizeStatus(proj.status);
    if (key === 'COMPLETED') return 100;
    if (key === 'PLANNED') return 10;
    if (key === 'ON_HOLD') return 35;
    if (key === 'CANCELLED') return 0;
    return 65; // Default for ACTIVE / other
  };

  // Callbacks for CRUD actions
  const handleProjectCreated = (newProject) => {
    setLocalProjects((prev) => [newProject, ...prev]);
    if (onRefresh) onRefresh();
  };

  const handleProjectUpdated = (updatedProject) => {
    setLocalProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
    );
    if (onRefresh) onRefresh();
  };

  const handleProjectDeleted = (projectId) => {
    setLocalProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (onRefresh) onRefresh();
  };

  const handleDeleteClick = (project) => {
    Swal.fire({
      title: 'Confirm Delete Project',
      html: `
        <div class="text-left text-xs text-slate-600">
          <p class="mb-2 font-medium text-slate-700">Are you sure you want to permanently delete this project record?</p>
          <p class="mb-2">Project: <strong>${project.name}</strong> (Code: ${project.code || `#${project.id}`})</p>
          <ul class="pl-4 list-disc text-slate-500 flex flex-col gap-1">
            <li>This action cannot be undone.</li>
            <li>All associated tasks or timeline tracking for this project may be affected.</li>
          </ul>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Project',
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
          const res = await deleteProjectApi(project.id);
          if (res && res.success === false) {
            throw new Error(res.message || 'Failed to delete project');
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
          triggerToast(`Project "${project.name}" deleted successfully!`);
        }
        handleProjectDeleted(project.id);
      }
    });
  };

  // Client-side filtering fallback if backend pagination is off
  const filteredProjects = projectsList.filter((proj) => {
    // 1. Search query filter
    const q = currentSearch.toLowerCase().trim();
    if (q) {
      const name = (proj.name || '').toLowerCase();
      const code = (proj.code || '').toLowerCase();
      const desc = (proj.description || '').toLowerCase();
      const lead = (proj.lead || proj.project_manager_name || '').toLowerCase();
      const dept = (proj.dept || proj.department_name || '').toLowerCase();
      if (!name.includes(q) && !code.includes(q) && !desc.includes(q) && !lead.includes(q) && !dept.includes(q)) {
        return false;
      }
    }

    // 2. Status filter
    if (currentStatus && currentStatus !== 'all' && currentStatus !== 'All') {
      if (proj.status !== currentStatus) {
        return false;
      }
    }

    // 3. Priority filter
    if (currentPriority && currentPriority !== 'all' && currentPriority !== 'All') {
      if (proj.priority !== currentPriority) {
        return false;
      }
    }



    return true;
  });

  const displayedProjects = filteredProjects;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Project Directory Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
              🚀 Enterprise Projects & Delivery Status
            </span>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Manage corporate initiatives, timelines, budgets, and project manager assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <FilterDropdown
              value={{
                search: currentSearch,
                status: currentStatus,
                priority: currentPriority
              }}
              onApply={(filters) => {
                handleSearchChange(filters.search || '');
                handleStatusChange(filters.status || 'all');
                handlePriorityChange(filters.priority || 'all');
              }}
              config={[
                {
                  id: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'PLANNED', label: 'Planned' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'ON_HOLD', label: 'On Hold' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'CANCELLED', label: 'Cancelled' }
                  ],
                  defaultValue: 'all'
                },
                {
                  id: 'priority',
                  label: 'Priority',
                  type: 'select',
                  options: [
                    { value: 'all', label: 'All Priority' },
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'CRITICAL', label: 'Critical' }
                  ],
                  defaultValue: 'all'
                },
                {
                  id: 'search',
                  label: 'Keyword search',
                  type: 'text',
                  placeholder: 'Search name, code, lead...',
                  defaultValue: ''
                }
              ]}
            />

            {/* Add Project Button */}
            {hasPermission('add_project') && (
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                onClick={() => {
                  if (setShowAddProjModal) setShowAddProjModal(true);
                  else setShowFormModal(true);
                }}
              >
                <span>+</span> Add Project
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

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold">Fetching projects from backend API...</span>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No projects found</h3>
            <p className="text-xs text-slate-500 m-0">Try clearing or adjusting your search & filter parameters.</p>
            {(currentSearch || currentStatus !== 'all' || currentPriority !== 'all') && (
              <button
                onClick={() => {
                  handleSearchChange('');
                  handleStatusChange('all');
                  handlePriorityChange('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Project Card Grid (Preserved & Enhanced UI) */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProjects.map((proj) => {
                const progressPct = getProgressPercentage(proj);
                const leadName = proj.project_manager_name || proj.lead || 'Unassigned';
                const deptName = proj.department_name || proj.dept || 'General';

                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Header: Title & Badges */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {proj.code && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold shrink-0">
                              {proj.code}
                            </span>
                          )}
                          <div
                            className="font-bold text-slate-900 text-base truncate cursor-pointer group-hover:text-indigo-600 transition-colors"
                            onClick={() => setSelectedProject(proj)}
                            title="Click to view details"
                          >
                            {proj.name}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 truncate">
                          Lead: <strong className="text-slate-700 font-semibold">{leadName}</strong> ({deptName})
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(proj.status)}`}>
                          {proj.status || 'ACTIVE'}
                        </span>
                        {proj.priority && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityBadgeStyle(proj.priority)}`}>
                            {proj.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                        <span>Progress Completion</span>
                        <span className="font-semibold text-slate-900">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Description snippet if present */}
                    {proj.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 m-0 font-normal">
                        {proj.description}
                      </p>
                    )}

                    {/* Card Footer Info */}
                    <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-3 text-slate-500">
                      <span>Target: {formatDate(proj.end_date || proj.deadline || proj.start_date)}</span>
                      <span className="font-semibold text-indigo-600">
                        Budget: {proj.budget ? (String(proj.budget).startsWith('$') ? proj.budget : `$${Number(proj.budget).toLocaleString()}`) : 'N/A'}
                      </span>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-200/60">
                      {/* View */}
                      <button
                        type="button"
                        title="View Details"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        onClick={() => setSelectedProject(proj)}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View</span>
                      </button>

                      {/* Edit */}
                      {hasPermission('change_project') && (
                        <button
                          type="button"
                          title="Edit Project"
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          onClick={() => setEditingProject(proj)}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                      )}

                      {/* Delete */}
                      {hasPermission('delete_project') && (
                        <button
                          type="button"
                          title="Delete Project"
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          onClick={() => handleDeleteClick(proj)}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Component */}
            <Pagination
              pagination={paginationInfo}
              currentPage={currentPage}
              totalItems={displayedProjects.length}
              onPageChange={onPageChange}
              className="-mx-6 -mb-6 mt-6 rounded-b-2xl border-t border-slate-200"
            />
          </>
        )}
      </div>

      {/* Modals */}

      {/* 1. Add / Create Project Modal */}
      {showFormModal && (
        <ProjectFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onProjectCreated={handleProjectCreated}
          departments={departments}
          employees={employees}
          triggerToast={triggerToast}
        />
      )}

      {/* 2. View / Show Project Modal */}
      {selectedProject && (
        <ProjectShowModal
          project={selectedProject}
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          onEditProject={(proj) => setEditingProject(proj)}
          onDeleteProject={(proj) => handleDeleteClick(proj)}
        />
      )}

      {/* 3. Edit Project Modal */}
      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          isOpen={Boolean(editingProject)}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={handleProjectUpdated}
          departments={departments}
          employees={employees}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
