import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../../context/AuthContext';
import { getCompanyId } from '../../utils/storage';
import { fetchCompanyByIdApi, updateCompanyApi } from '../../api/admin/companyApi';
import Skeleton from '../common/Skeleton';

export default function CompanyProfile({ triggerToast }) {
  const authCtx = useContext(AuthContext);
  const activeCompanyId = authCtx?.companyId || getCompanyId() || authCtx?.currentUser?.company_id || 1;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    is_active: true
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const loadCompanyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCompanyByIdApi(activeCompanyId);
      if (res && res.success && res.company) {
        setCompany(res.company);
      } else {
        setError(res?.message || 'Failed to load company profile details');
      }
    } catch (err) {
      console.error('Error in CompanyProfile:', err);
      setError(err?.message || 'Network error loading company profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCompanyId]);

  const handleOpenEditModal = () => {
    if (!company) return;
    setEditFormData({
      name: company.name || '',
      code: company.code || '',
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || '',
      is_active: company.is_active ?? true
    });
    setUpdateError(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);

    try {
      const res = await updateCompanyApi(company.id || activeCompanyId, editFormData);
      if (res && res.success) {
        setCompany((prev) => ({
          ...prev,
          ...editFormData,
          ...(res.data || {})
        }));
        if (triggerToast) {
          triggerToast('Company profile updated successfully!');
        }
        setShowEditModal(false);
      } else {
        setUpdateError(res?.message || 'Failed to update company profile');
      }
    } catch (err) {
      console.error('Update company error:', err);
      setUpdateError(err?.message || 'Network error updating company profile');
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return <Skeleton.Profile />;
  }

  if (error || !company) {
    return (
      <div className="w-full flex flex-col gap-6 animate-fadeIn">
        <div className="p-8 rounded-3xl bg-rose-50/60 border border-rose-200 shadow-lg flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-bold text-rose-900 m-0">Unable to Load Company Profile</h3>
          <p className="text-xs text-rose-700 max-w-md m-0">{error || 'Company information is unavailable.'}</p>
          <button
            onClick={loadCompanyData}
            className="mt-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-all cursor-pointer shadow-md"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const modalContent = showEditModal ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-2xl animate-cardFadeUp overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h3 className="text-lg font-bold text-slate-900 m-0 flex items-center gap-2">
              <span>🏢</span> Edit Company Profile
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Update enterprise credentials, contact info, and address.
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

            {/* Company Name & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 mb-1 block">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  placeholder="Nexus Technologies"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">
                  Code Tag
                </label>
                <input
                  type="text"
                  name="code"
                  value={editFormData.code}
                  onChange={handleEditChange}
                  placeholder="NEXUS"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  placeholder="info@nexustech.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
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
            </div>

            {/* Website */}
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={editFormData.website}
                onChange={handleEditChange}
                placeholder="https://nexustech.com"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={editFormData.address}
                onChange={handleEditChange}
                placeholder="123 Innovation Way"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">City</label>
                <input
                  type="text"
                  name="city"
                  value={editFormData.city}
                  onChange={handleEditChange}
                  placeholder="San Francisco"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={editFormData.state}
                  onChange={handleEditChange}
                  placeholder="California"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Country</label>
                <input
                  type="text"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditChange}
                  placeholder="USA"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Status Switch */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mt-1">
              <div>
                <span className="font-bold text-slate-800 block">Organization Status</span>
                <span className="text-[11px] text-slate-500 block">Set operational active status</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editFormData.is_active}
                  onChange={handleEditChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-700">
                  {editFormData.is_active ? 'Active' : 'Inactive'}
                </span>
              </label>
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
                <span>Save Company Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Company Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xl text-slate-900 p-6 sm:p-8">
        {/* Subtle Decorative Background Element */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-50/80 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-2xl border border-slate-200 object-cover shadow-md bg-slate-50 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
                {company.name ? company.name.substring(0, 2).toUpperCase() : 'CO'}
              </div>
            )}

            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 m-0 tracking-tight leading-tight">
                  {company.name}
                </h1>
                {company.code && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold">
                    {company.code}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${
                    company.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  <span className={company.is_active ? 'text-emerald-500' : 'text-rose-500'}>●</span>
                  {company.is_active ? 'Active Enterprise' : 'Inactive Enterprise'}
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium m-0 mt-1 flex items-center gap-2">
                <span>🏢 Registered Organization Profile</span>
                <span>•</span>
                <span>ID: #{company.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenEditModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>✏️</span>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Contact Information */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col gap-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>📞</span> Contact Information
          </h3>

          <div className="flex flex-col gap-3.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200 text-sm shadow-xs">✉️</span>
              <div className="overflow-hidden">
                <span className="text-[11px] text-slate-400 font-medium block">Official Email</span>
                <span className="font-bold text-slate-800 break-all">{company.email || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200 text-sm shadow-xs">📱</span>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Phone Line</span>
                <span className="font-bold text-slate-800">{company.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200 text-sm shadow-xs">🌐</span>
              <div className="overflow-hidden">
                <span className="text-[11px] text-slate-400 font-medium block">Company Website</span>
                {company.website ? (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-indigo-600 hover:underline break-all"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="font-bold text-slate-400">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Location & Address */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col gap-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>📍</span> Location & Address
          </h3>

          <div className="flex flex-col gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Street Address</span>
              <span className="font-bold text-slate-800">{company.address || 'N/A'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
                <span className="text-[11px] text-slate-400 font-medium">City</span>
                <span className="font-bold text-slate-800">{company.city || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
                <span className="text-[11px] text-slate-400 font-medium">State / Region</span>
                <span className="font-bold text-slate-800">{company.state || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Country</span>
              <span className="font-bold text-slate-800">{company.country || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Column 3: System Audit & Meta */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col gap-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider m-0 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🕒</span> System & Audit Info
          </h3>

          <div className="flex flex-col gap-3.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Organization System ID</span>
              <span className="font-mono font-extrabold text-indigo-600 text-sm">#{company.id}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Registration Date</span>
              <span className="font-bold text-slate-800">{formatDate(company.created_at)}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 font-medium">Last Profile Update</span>
              <span className="font-bold text-slate-800">{formatDate(company.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Profile Modal Portal */}
      {modalContent && typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </div>
  );
}

