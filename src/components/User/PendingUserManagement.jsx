import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import Pagination from '../common/Pagination';
import { useAuth } from '../../hooks/useAuth';
import FilterDropdown from '../common/FilterDropdown';
import Skeleton from '../common/Skeleton';

export default function PendingUserManagement({
  pendingUsersList = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  onApprove,
  onReject,
  triggerToast
}) {
  const { hasPermission } = useAuth();
  const [localPendingUsers, setLocalPendingUsers] = useState(Array.isArray(pendingUsersList) ? pendingUsersList : []);
  const [localSearch, setLocalSearch] = useState('');

  // Confirmation Modal state
  const [modalAction, setModalAction] = useState(null); // { type: 'approve' | 'reject', user: object }
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLocalPendingUsers(Array.isArray(pendingUsersList) ? pendingUsersList : []);
  }, [pendingUsersList]);

  const currentSearch = setSearchTerm ? searchTerm : localSearch;
  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
  };

  // Helper functions
  const getUserFullName = (user) => {
    const fn = user?.first_name || '';
    const ln = user?.last_name || '';
    const full = `${fn} ${ln}`.trim();
    return full || user?.username || `User #${user?.id}`;
  };

  const getUserAvatar = (user) => {
    if (user?.profile_image) return user.profile_image;
    const name = getUserFullName(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=fff`;
  };

  const formatRoleName = (roleName) => {
    if (!roleName) return 'Standard Employee';
    return String(roleName).replace(/_/g, ' ').toUpperCase();
  };

  const getRoleBadgeStyle = (roleName) => {
    const role = String(roleName || '').toLowerCase();
    if (role.includes('admin')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (role.includes('hr')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (role.includes('project')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (role.includes('department') || role.includes('dept')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (role.includes('employee')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getCompanyName = (user) => {
    if (user?.company_name) return user.company_name;
    if (user?.company && typeof user.company === 'object') {
      return user.company.name || user.company.code || `Company #${user.company.id}`;
    }
    if (typeof user?.company === 'string' || typeof user?.company === 'number') {
      return `Company #${user.company}`;
    }
    return 'N/A';
  };

  const getCompanyCode = (user) => {
    if (user?.company && typeof user.company === 'object' && user.company.code) {
      return user.company.code;
    }
    return null;
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

  // Client-side search filtering fallback if backend pagination is not active
  const filteredUsers = localPendingUsers.filter((u) => {
    const query = currentSearch.toLowerCase().trim();
    if (query) {
      const fullName = getUserFullName(u).toLowerCase();
      const username = (u.username || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const compName = getCompanyName(u).toLowerCase();
      const matches =
        fullName.includes(query) ||
        username.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        compName.includes(query);
      if (!matches) return false;
    }



    return true;
  });

  const displayedUsers = filteredUsers;

  // Execute approval
  const handleConfirmAction = async () => {
    if (!hasPermission('user:manage_pending')) {
      triggerToast?.('You do not have permission to approve pending users.');
      setModalAction(null);
      return;
    }
    if (!modalAction || !modalAction.user) return;
    const { user } = modalAction;
    setActionLoading(true);

    try {
      if (onApprove) {
        await onApprove(user.id);
      }
      setModalAction(null);
    } catch (err) {
      console.error(`Error performing approval on user ${user.id}:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  // Execute rejection via SweetAlert2
  const handleRejectClick = (targetUser) => {
    if (!hasPermission('user:manage_pending')) {
      triggerToast?.('You do not have permission to reject pending users.');
      return;
    }
    const fullName = getUserFullName(targetUser);

    const htmlContent = `
      <div class="flex flex-col gap-3 text-left">
        <p class="text-xs text-slate-600 leading-relaxed m-0">
          Rejecting this user will mark their account status as 'Rejected'.
        </p>
      </div>
    `;

    Swal.fire({
      title: 'Reject User Registration',
      html: htmlContent,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject User',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'rounded-2xl border border-slate-200 shadow-2xl p-6 text-slate-900 bg-white',
        title: 'text-base font-bold text-slate-900 m-0',
        htmlContainer: 'mt-3 mb-5',
        actions: 'flex gap-3 justify-end w-full mt-4',
        confirmButton: 'px-5 py-2.5 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
        cancelButton: 'px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer'
      },
      preConfirm: async () => {
        try {
          if (onReject) {
            await onReject(targetUser.id);
          }
          return true;
        } catch (err) {
          Swal.showValidationMessage(`Request failed: ${err.message || err}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && triggerToast) {
        triggerToast(`User "${fullName}" rejected successfully!`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Card matching UserManagement layout */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>⏳</span> Pending Users Directory
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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
                  placeholder: 'Search name, email, company...',
                  defaultValue: ''
                }
              ]}
            />
          </div>
        </div>

        {/* Notice/Error Bar */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex justify-between items-center">
            <span>⚠️ API Note: {error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <Skeleton.Table
            rows={3}
            columns={[
              { type: 'avatar-text', className: 'py-3 px-4' },
              { type: 'text', className: 'py-3 px-4' },
              { type: 'pill', className: 'py-3 px-4' },
              { type: 'text', className: 'py-3 px-4 hidden md:table-cell' },
              ...(hasPermission('user:manage_pending') ? [{ type: 'actions', className: 'py-3 px-4 text-center w-[100px]' }] : [])
            ]}
          />
        ) : displayedUsers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🎉</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No pending users found</h3>
            <p className="text-xs text-slate-500 m-0">All user requests have been reviewed or match no filters.</p>
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
          /* Table View */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden md:table-cell">Joined Date</th>
                    {hasPermission('user:manage_pending') && <th className="py-3 px-4 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedUsers.map((u) => {
                    const fullName = getUserFullName(u);
                    const avatarUrl = getUserAvatar(u);
                    const roleNameDisplay = formatRoleName(u.role_name || u.role);
                    const roleBadgeClass = getRoleBadgeStyle(u.role_name || u.role);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* User Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{fullName}</span>
                              <span className="text-xs text-slate-500">{u.email || u.username || `ID: ${u.id}`}</span>
                              {u.phone && <span className="text-[0.7rem] text-slate-400">📞 {u.phone}</span>}
                            </div>
                          </div>
                        </td>

                        {/* Role Name */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeClass}`}>
                            🔑 {roleNameDisplay}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending Approval
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs font-medium hidden md:table-cell">
                          {formatDate(u.created_at || u.date_joined)}
                        </td>

                        {/* Actions */}
                        {(hasPermission('user:edit') || hasPermission('user:manage_pending')) && (
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setModalAction({ type: 'approve', user: u })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                              >
                                <span>✓</span> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectClick(u)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                              >
                                <span>✕</span> Reject
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {paginationInfo && onPageChange && (
              <Pagination
                pagination={paginationInfo}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalAction && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-emerald-100 text-emerald-600">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 m-0">
                  Approve User Registration
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  Please confirm your action for this account.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm flex flex-col gap-1">
              <span className="font-semibold text-slate-800">
                {getUserFullName(modalAction.user)}
              </span>
              <span className="text-xs text-slate-500">
                {modalAction.user.email || modalAction.user.username}
              </span>
              <div className="mt-2 text-xs text-slate-600">
                Role: <strong className="text-slate-800">{formatRoleName(modalAction.user.role_name || modalAction.user.role)}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed m-0">
              Approving this user will mark their account status as 'Approve' and allow them to access the system.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setModalAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700"
              >
                {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Approve User
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
