import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserData } from '../../utils/storage';
import { fetchUserByIdApi, updateUserApi } from '../../api/admin/userApi';
import Skeleton from '../common/Skeleton';

export default function MyProfile({ triggerToast }) {
  const authCtx = useContext(AuthContext);
  const currentUser = authCtx?.currentUser || {};
  const storedUser = getUserData();
  const initialUser = storedUser || currentUser || {};

  const [profileUser, setProfileUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const loadProfileData = async () => {
    const localData = getUserData() || currentUser;
    if (localData) {
      setProfileUser(localData);
    }

    const userId = localData?.id || currentUser?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchUserByIdApi(userId);
      if (res && (res.success || res.id)) {
        const userData = res.data || res;
        setProfileUser((prev) => ({ ...prev, ...userData }));
      }
    } catch (err) {
      console.error('Error fetching my profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleOpenEditModal = () => {
    setEditFormData({
      username: profileUser.username || '',
      first_name: profileUser.first_name || '',
      last_name: profileUser.last_name || '',
      email: profileUser.email || '',
      phone: profileUser.phone || '',
      password: ''
    });
    setUpdateError(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);

    const payload = {
      username: editFormData.username || profileUser.username || currentUser.username,
      email: editFormData.email || profileUser.email || currentUser.email,
      first_name: editFormData.first_name,
      last_name: editFormData.last_name,
      phone: editFormData.phone
    };
    if (editFormData.password) {
      payload.password = editFormData.password;
    }

    try {
      const res = await updateUserApi(profileUser.id || currentUser.id, payload);
      if (res && (res.success || res.id)) {
        const updatedData = res.data || res;
        setProfileUser((prev) => ({
          ...prev,
          ...payload,
          ...(typeof updatedData === 'object' ? updatedData : {})
        }));
        if (triggerToast) {
          triggerToast('Profile updated successfully!');
        }
        setShowEditModal(false);
      } else {
        let errMessage = res?.message || 'Failed to update profile details';
        if (res?.errors && typeof res.errors === 'object') {
          const errList = Object.entries(res.errors).map(([field, msgs]) => {
            const fieldName = field.replace('_', ' ');
            const msgStr = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
            return `${fieldName}: ${msgStr}`;
          });
          if (errList.length > 0) {
            errMessage = errList.join(' | ');
          }
        }
        setUpdateError(errMessage);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setUpdateError(err?.message || 'Network error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const getUserFullName = (u) => {
    if (!u) return 'User Profile';
    const fn = typeof u.first_name === 'string' ? u.first_name : '';
    const ln = typeof u.last_name === 'string' ? u.last_name : '';
    const full = `${fn} ${ln}`.trim();
    return full || (typeof u.username === 'string' ? u.username : '') || `User #${u.id ?? ''}`;
  };

  const getUserAvatar = (u) => {
    if (!u) return 'https://ui-avatars.com/api/?name=User&background=64748b&color=fff&size=128';
    if (u.profile_image) return u.profile_image;
    const name = getUserFullName(u);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=64748b&color=fff&size=128`;
  };

  const getRoleName = (u) => {
    if (!u) return 'SUPER ADMIN';
    if (typeof u.role === 'object' && u.role !== null && u.role.name) {
      return String(u.role.name);
    }
    if (u.role_name) return String(u.role_name);
    if (typeof u.role === 'string' && u.role) return u.role;
    return 'SUPER ADMIN';
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
    if (role.includes('employee')) return 'bg-sky-100 text-sky-700 border-sky-300';
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

  const fullName = getUserFullName(profileUser);
  const avatarUrl = getUserAvatar(profileUser);

  if (loading) {
    return <Skeleton.Profile />;
  }

  const modalContent = showEditModal ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>👤</span> Edit My Profile
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Update personal identity details and security settings.
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 text-xl font-semibold cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setShowEditModal(false)}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdateSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
            {updateError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{updateError}</span>
              </div>
            )}

            {/* Read-only Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-500 mb-1 flex items-center justify-between">
                  <span>Username</span>
                  <span className="text-[10px] text-slate-400 font-normal">Read-only</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  disabled
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 cursor-not-allowed select-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-500 mb-1 flex items-center justify-between">
                  <span>Work Email</span>
                  <span className="text-[10px] text-slate-400 font-normal">Read-only</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  disabled
                  readOnly
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditChange}
                  required
                  placeholder="John"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditChange}
                  required
                  placeholder="Doe"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                placeholder="+15550199"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Change Password Optional */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col gap-2 mt-1">
              <label className="font-bold text-slate-800 text-xs block">
                Change Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
                placeholder="Leave blank to keep current password"
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
              <span className="text-[11px] text-slate-500 font-medium">
                Only fill this field if you want to update your security password.
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 p-6 py-4 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition-all cursor-pointer"
              onClick={() => setShowEditModal(false)}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {updating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xl text-slate-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-20 h-20 rounded-2xl border-2 border-slate-200 object-cover shadow-md bg-slate-100 shrink-0"
            />
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 m-0 tracking-tight leading-tight">
                  {fullName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getRoleBadgeStyle(getRoleName(profileUser))}`}>
                  {formatRoleName(getRoleName(profileUser))}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${
                    profileUser.is_active !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  <span className={profileUser.is_active !== false ? 'text-emerald-500' : 'text-rose-500'}>●</span>
                  {profileUser.is_active !== false ? 'Active Account' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs text-indigo-600 font-semibold m-0 mt-1 flex items-center gap-2">
                <span>@{profileUser.username || 'user'}</span>
                <span>•</span>
                <span className="text-slate-500">ID: #{profileUser.id || 'N/A'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>✏️</span>
            <span>Edit My Profile</span>
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Identity & Contact Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col gap-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🪪</span> Identity & Contact Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">First Name</span>
              <span className="font-bold text-slate-800">{profileUser.first_name || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Last Name</span>
              <span className="font-bold text-slate-800">{profileUser.last_name || 'N/A'}</span>
            </div>
            <div className="col-span-2 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Work Email</span>
              <span className="font-bold text-slate-800 break-all">{profileUser.email || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Phone Number</span>
              <span className="font-bold text-slate-800">{profileUser.phone || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Username</span>
              <span className="font-bold text-slate-800">@{profileUser.username || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Audit Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col gap-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🛡️</span> Security & System Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Assigned Role</span>
              <span className="font-bold text-slate-800">{formatRoleName(getRoleName(profileUser))}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">User System ID</span>
              <span className="font-mono font-bold text-indigo-600">#{profileUser.id || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Account Created</span>
              <span className="font-bold text-slate-800">{formatDate(profileUser.created_at)}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <span className="text-[11px] text-slate-400 font-medium block">Last Updated</span>
              <span className="font-bold text-slate-800">{formatDate(profileUser.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      {modalContent && typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </div>
  );
}
