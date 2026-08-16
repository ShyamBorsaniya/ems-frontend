import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchUserByIdApi } from '../../api/admin/userApi';

export default function UserShowModal({
  user,
  isOpen,
  onClose,
  onEditUser,
  onSoftDestroyUser,
  triggerToast
}) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user && isOpen) {
      setUserData(user);
      if (user.id) {
        setLoading(true);
        fetchUserByIdApi(user.id)
          .then((res) => {
            if (!isMounted) return;
            if (res && (res.data || res.id)) {
              const fresh = res.data || res;
              setUserData((prev) => ({ ...prev, ...fresh }));
            }
          })
          .catch((err) => {
            console.warn('Could not fetch fresh user details:', err);
          })
          .finally(() => {
            if (isMounted) setLoading(false);
          });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const currentUser = userData || user;

  const getUserFullName = (u) => {
    if (!u) return 'User';
    const fn = typeof u.first_name === 'string' ? u.first_name : '';
    const ln = typeof u.last_name === 'string' ? u.last_name : '';
    const full = `${fn} ${ln}`.trim();
    return full || (typeof u.username === 'string' ? u.username : '') || `User #${u.id ?? ''}`;
  };

  const getUserAvatar = (u) => {
    if (!u) return 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff&size=128';
    if (u.profile_image) return u.profile_image;
    const name = getUserFullName(u);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=128`;
  };

  const getRoleName = (u) => {
    if (!u) return 'SUPER ADMIN';
    if (typeof u.role === 'object' && u.role !== null && u.role.name) {
      return String(u.role.name);
    }
    if (u.role_name) {
      return String(u.role_name);
    }
    if (typeof u.role === 'string' && u.role) {
      return u.role;
    }
    return 'SUPER ADMIN';
  };

  const getRoleId = (u) => {
    if (!u) return 'N/A';
    if (typeof u.role === 'object' && u.role !== null && u.role.id !== undefined) {
      return String(u.role.id);
    }
    if (u.role !== null && u.role !== undefined) {
      return String(u.role);
    }
    return 'N/A';
  };

  const formatRoleName = (roleVal) => {
    if (!roleVal && roleVal !== 0) return 'SUPER ADMIN';
    if (typeof roleVal === 'object' && roleVal !== null) {
      roleVal = roleVal.name || roleVal.title || 'SUPER ADMIN';
    }
    const str = String(roleVal);
    return str.replace(/_/g, ' ').toUpperCase();
  };

  const getRoleBadgeStyle = (roleVal) => {
    if (typeof roleVal === 'object' && roleVal !== null) {
      roleVal = roleVal.name || roleVal.title || '';
    }
    const role = String(roleVal || '').toLowerCase();
    if (role.includes('admin')) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (role.includes('hr')) return 'bg-pink-100 text-pink-700 border-pink-300';
    if (role.includes('project')) return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    if (role.includes('department') || role.includes('dept')) return 'bg-amber-100 text-amber-700 border-amber-300';
    if (role.includes('employee')) return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(isoString);
    }
  };

  const fullName = getUserFullName(currentUser);
  const avatarUrl = getUserAvatar(currentUser);

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl text-slate-900 shadow-2xl animate-cardFadeUp my-8 overflow-hidden">
        {/* Top Banner Gradient */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative p-6 flex justify-end items-start">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-lg flex items-center justify-center cursor-pointer transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Profile Header Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg bg-white shrink-0"
              />
              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-slate-900 m-0 leading-tight">
                  {fullName}
                </h2>
                <p className="text-xs text-indigo-600 font-semibold m-0 mt-0.5">
                  @{currentUser.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-1">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeStyle(getRoleName(currentUser))}`}>
                {formatRoleName(getRoleName(currentUser))}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  currentUser.is_active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                <span className={currentUser.is_active ? 'text-emerald-500' : 'text-rose-500'}>●</span>
                {currentUser.is_active ? 'Active Account' : 'Inactive / Soft Destroyed'}
              </span>
            </div>
          </div>

          {/* Loading Indicator for Fresh Backend Data */}
          {loading && (
            <div className="mb-4 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
              <span>Fetching latest profile data from backend...</span>
            </div>
          )}

          {/* Details Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Card 1: Identity & Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🪪</span> Identity & Contact Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 font-medium block">First Name</span>
                  <span className="font-semibold text-slate-800">{currentUser.first_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Last Name</span>
                  <span className="font-semibold text-slate-800">{currentUser.last_name || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Work Email</span>
                  <span className="font-semibold text-slate-800 break-all">{currentUser.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Phone Number</span>
                  <span className="font-semibold text-slate-800">{currentUser.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Username</span>
                  <span className="font-semibold text-slate-800">@{currentUser.username}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Role Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🛡️</span> Role Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 font-medium block">Assigned Role</span>
                  <span className="font-semibold text-slate-800">{formatRoleName(getRoleName(currentUser))}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Role ID</span>
                  <span className="font-semibold text-slate-800">{getRoleId(currentUser)}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Timestamps & Access */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span>🕒</span> Audit & Account Timestamps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 font-medium block">User System ID</span>
                  <span className="font-mono font-semibold text-indigo-600">#{currentUser.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Account Created</span>
                  <span className="font-semibold text-slate-800">{formatDate(currentUser.created_at)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Last Profile Update</span>
                  <span className="font-semibold text-slate-800">{formatDate(currentUser.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
              onClick={onClose}
            >
              Close Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
