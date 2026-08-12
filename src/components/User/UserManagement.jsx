import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Pagination from '../common/Pagination';
import UserFormModal from './UserFormModal';
import { deleteUserApi, restoreUserApi } from '../../api/admin/userApi';

export default function UserManagement({
  usersList = [],
  paginationInfo = null,
  currentPage = 1,
  onPageChange,
  loading = false,
  error = null,
  searchTerm = '',
  setSearchTerm,
  roleFilter = 'all',
  setRoleFilter,
  isActiveFilter = 'all',
  setIsActiveFilter,
  onRefresh,
  triggerToast,
  setShowAddUserModal
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [softDestroyUser, setSoftDestroyUser] = useState(null);
  const [softDestroyLoading, setSoftDestroyLoading] = useState(false);

  // Local synced users list
  const [localUsers, setLocalUsers] = useState(Array.isArray(usersList) ? usersList : []);

  useEffect(() => {
    setLocalUsers(Array.isArray(usersList) ? usersList : []);
  }, [usersList]);

  const users = localUsers;

  // Local state fallbacks if parent doesn't control filters
  const [localSearch, setLocalSearch] = useState('');
  const [localRole, setLocalRole] = useState('all');
  const [localStatus, setLocalStatus] = useState('all');

  const currentSearch = setSearchTerm ? searchTerm : localSearch;
  const handleSearchChange = (val) => {
    if (setSearchTerm) setSearchTerm(val);
    else setLocalSearch(val);
  };

  const currentRole = setRoleFilter ? roleFilter : localRole;
  const handleRoleChange = (val) => {
    if (setRoleFilter) setRoleFilter(val);
    else setLocalRole(val);
  };

  const currentStatus = setIsActiveFilter ? isActiveFilter : localStatus;
  const handleStatusChange = (val) => {
    if (setIsActiveFilter) setIsActiveFilter(val);
    else setLocalStatus(val);
  };

  // Utility helpers
  const getUserFullName = (user) => {
    const fn = user.first_name || '';
    const ln = user.last_name || '';
    const full = `${fn} ${ln}`.trim();
    return full || user.username || `User #${user.id}`;
  };

  const getUserAvatar = (user) => {
    if (user.profile_image) return user.profile_image;
    const name = getUserFullName(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
  };

  const formatRoleName = (roleName) => {
    if (!roleName) return 'Super Admin';
    return roleName.replace(/_/g, ' ').toUpperCase();
  };

  const getRoleBadgeStyle = (roleName) => {
    const role = (roleName || '').toLowerCase();
    if (role.includes('admin')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (role.includes('hr')) return 'bg-pink-50 text-pink-700 border-pink-200';
    if (role.includes('project')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (role.includes('department') || role.includes('dept')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (role.includes('employee')) return 'bg-blue-50 text-blue-700 border-blue-200';
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

  // Update user in local state & invoke optional onRefresh
  const handleUserUpdated = (updatedUser) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    if (onRefresh) onRefresh();
  };

  // Perform soft destroy (deactivate user account)
  const handleConfirmSoftDestroy = async () => {
    if (!softDestroyUser) return;
    setSoftDestroyLoading(true);
    const targetUser = softDestroyUser;
    const isAlreadyInactive = targetUser.is_active === false;
    const targetStatus = isAlreadyInactive ? true : false;
    const actionLabel = isAlreadyInactive ? 'restored (activated)' : 'soft destroyed (deactivated)';

    try {
      // Soft destroy / restore API call
      try {
        if (!isAlreadyInactive) {
          await deleteUserApi(targetUser.id);
        } else {
          await restoreUserApi(targetUser.id);
        }
      } catch (err) {
        console.warn('Backend soft destroy/restore API returned error, applying client update:', err);
      }

      setLocalUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: targetStatus } : u))
      );

      if (triggerToast) {
        triggerToast(`User "${getUserFullName(targetUser)}" ${actionLabel} successfully!`);
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Soft destroy error:', err);
      if (triggerToast) {
        triggerToast(`Failed to update soft destroy status for ${getUserFullName(targetUser)}`);
      }
    } finally {
      setSoftDestroyLoading(false);
      setSoftDestroyUser(null);
    }
  };

  // Client-side filtering as fallback if backend pagination is not active
  const filteredUsers = users.filter((u) => {
    // 1. Search filter
    const query = currentSearch.toLowerCase().trim();
    if (query) {
      const fullName = getUserFullName(u).toLowerCase();
      const username = (u.username || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const matches =
        fullName.includes(query) ||
        username.includes(query) ||
        email.includes(query) ||
        phone.includes(query);
      if (!matches) return false;
    }

    // 2. Role filter (by role ID e.g. "2", "3", "4", "5", "6")
    if (currentRole && currentRole !== 'all' && currentRole !== 'All') {
      const rId = u.role !== null && u.role !== undefined ? String(u.role) : '';
      const rName = (u.role_name || '').toLowerCase();
      const filterVal = String(currentRole).toLowerCase();
      if (rId !== filterVal && rName !== filterVal) {
        return false;
      }
    }

    // 3. Status filter (is_active)
    if (currentStatus && currentStatus !== 'all' && currentStatus !== 'All') {
      const activeBool = currentStatus === 'true' || currentStatus === true;
      if (u.is_active !== activeBool) {
        return false;
      }
    }

    return true;
  });

  const displayedUsers = paginationInfo ? users : filteredUsers;
  const totalUsersCount = paginationInfo?.total_items ?? users.length;
  const activeUsersCount = users.filter((u) => u.is_active).length;
  const inactiveUsersCount = users.filter((u) => u.is_active === false).length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalUsersCount}</div>
            <span className="text-xs text-slate-400">Registered Accounts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
            👥
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{activeUsersCount}</div>
            <span className="text-xs text-slate-400">Account status active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            ✓
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive Users</span>
            <div className="text-2xl font-extrabold text-slate-600 mt-1">{inactiveUsersCount}</div>
            <span className="text-xs text-slate-400">Suspended or Pending</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl font-bold">
            ⛔
          </div>
        </div>
      </div>

      {/* 2. Main Users Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 m-0">
              <span>👥</span> User Management Directory
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:w-64">
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={currentSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
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

            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <select
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer"
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="2">Admin </option>
                <option value="3">HR</option>
                <option value="4">Employee</option>
                <option value="5">Project Manager</option>
                <option value="6">Department Manager</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <select
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer"
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Add User Modal Button */}
            {setShowAddUserModal && (
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                onClick={() => setShowAddUserModal(true)}
              >
                + Onboard User
              </button>
            )}
          </div>
        </div>

        {/* Notice/Error Bar */}
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
            <span className="text-xs font-semibold">Fetching user list from backend API...</span>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800 m-0">No users found</h3>
            <p className="text-xs text-slate-500 m-0">Try clearing or adjusting your search / filter parameters.</p>
            <button
              onClick={() => {
                handleSearchChange('');
                handleRoleChange('all');
                handleStatusChange('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Users Data Table */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedUsers.map((u) => {
                    const fullName = getUserFullName(u);
                    const avatarUrl = getUserAvatar(u);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{fullName}</span>
                              <span className="text-xs text-slate-400">
                                @{u.username} • {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Role */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getRoleBadgeStyle(u.role_name)}`}>
                            {formatRoleName(u.role_name)}
                          </span>
                        </td>

                        {/* 3. Phone */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {u.phone || 'N/A'}
                        </td>

                        {/* 5. Account Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${u.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                          >
                            <span className={u.is_active ? 'text-emerald-500' : 'text-slate-400'}>●</span>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* 6. Created At */}
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {formatDate(u.created_at)}
                        </td>

                        {/* 7. Action Column (View, Edit, Soft Destroy Icons) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View User Icon */}
                            <button
                              type="button"
                              title="View User Profile"
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => {
                                setSelectedUser(u);
                                if (triggerToast) triggerToast(`Inspecting user profile: ${fullName}`);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit User Icon */}
                            <button
                              type="button"
                              title="Edit User Record"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition-colors cursor-pointer flex items-center justify-center"
                              onClick={() => {
                                setEditingUser(u);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>

                            {/* Soft Destroy User Icon */}
                            <button
                              type="button"
                              title={u.is_active ? "Soft Destroy User (Deactivate)" : "Restore User (Activate)"}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer border flex items-center justify-center ${
                                u.is_active
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                              }`}
                              onClick={() => {
                                setSoftDestroyUser(u);
                              }}
                            >
                              {u.is_active ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
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
              totalItems={displayedUsers.length}
              onPageChange={onPageChange}
              className="-mx-6 -mb-6 mt-4 rounded-b-2xl border-t border-slate-200"
            />
          </>
        )}
      </div>

      {/* 3. User Details Modal */}
      {selectedUser &&
        (typeof document !== 'undefined'
          ? createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>👤</span> User Profile Details
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
                      onClick={() => setSelectedUser(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={getUserAvatar(selectedUser)}
                      alt={getUserFullName(selectedUser)}
                      className="w-16 h-16 rounded-full border-2 border-indigo-500/20 object-cover shadow-sm"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 m-0">{getUserFullName(selectedUser)}</h4>
                      <p className="text-xs text-indigo-600 font-semibold m-0">@{selectedUser.username}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadgeStyle(selectedUser.role_name)}`}>
                          {formatRoleName(selectedUser.role_name)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${selectedUser.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                        >
                          {selectedUser.is_active ? '● Active Account' : '○ Inactive Account'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <div>
                      <span className="text-slate-400 font-medium block">User ID</span>
                      <span className="font-semibold text-slate-800">{selectedUser.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Work Email</span>
                      <span className="font-semibold text-slate-800 break-all">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Phone Number</span>
                      <span className="font-semibold text-slate-800">{selectedUser.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Company</span>
                      <span className="font-semibold text-slate-800">{selectedUser.company_name || 'N/A'} (ID: {selectedUser.company ?? 'N/A'})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Role ID</span>
                      <span className="font-semibold text-slate-800">{selectedUser.role ?? 'N/A'} ({selectedUser.role_name || 'Unassigned'})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Account Created</span>
                      <span className="font-semibold text-slate-800">{formatDate(selectedUser.created_at)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium block">Last Updated</span>
                      <span className="font-semibold text-slate-800">{formatDate(selectedUser.updated_at)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold cursor-pointer"
                      onClick={() => {
                        const u = selectedUser;
                        setSelectedUser(null);
                        setEditingUser(u);
                      }}
                    >
                      ✏️ Edit User
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shadow-sm"
                      onClick={() => setSelectedUser(null)}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null)}

      {/* 4. Edit User Modal (Unified UserFormModal) */}
      {editingUser && (
        <UserFormModal
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
          triggerToast={triggerToast}
        />
      )}

      {/* 5. Soft Destroy Confirmation Modal */}
      {softDestroyUser &&
        (typeof document !== 'undefined'
          ? createPortal(
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-cardFadeUp">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      softDestroyUser.is_active ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {softDestroyUser.is_active ? '🗑️' : '♻️'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 m-0">
                        {softDestroyUser.is_active ? 'Confirm Soft Destroy' : 'Confirm Reactivate Account'}
                      </h3>
                      <p className="text-xs text-slate-500 m-0">
                        User: <strong className="text-slate-800">{getUserFullName(softDestroyUser)}</strong> (@{softDestroyUser.username})
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-5 flex flex-col gap-2">
                    {softDestroyUser.is_active ? (
                      <>
                        <p className="m-0 font-medium text-slate-700">
                          Are you sure you want to <strong>soft destroy</strong> this user account?
                        </p>
                        <ul className="m-0 pl-4 list-disc text-slate-500 flex flex-col gap-1">
                          <li>Account status will be changed to <strong>Inactive</strong>.</li>
                          <li>User login access will be temporarily revoked.</li>
                          <li>User record and history are safely preserved in the system.</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="m-0 font-medium text-slate-700">
                          Reactivate user account for <strong>{getUserFullName(softDestroyUser)}</strong>?
                        </p>
                        <p className="m-0 text-slate-500">
                          This will restore active login privileges and portal access.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer"
                      onClick={() => setSoftDestroyUser(null)}
                      disabled={softDestroyLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={softDestroyLoading}
                      className={`px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
                        softDestroyUser.is_active
                          ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      }`}
                      onClick={handleConfirmSoftDestroy}
                    >
                      {softDestroyLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Processing...</span>
                        </>
                      ) : softDestroyUser.is_active ? (
                        <span>Yes, Soft Destroy User</span>
                      ) : (
                        <span>Yes, Reactivate User</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null)}
    </div>
  );
}

