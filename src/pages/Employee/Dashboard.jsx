import React, { useState, useEffect, useCallback } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import UserManagement from '../../components/User/UserManagement';
import ProjectManagement from '../../components/Project/ProjectManagement';
import AccessRestricted from '../../components/common/AccessRestricted';
import { fetchUsersApi } from '../../api/admin/userApi';
import { fetchProjectsApi } from '../../api/admin/projectApi';
import { useAuth } from '../../hooks/useAuth';

export default function EmployeeDashboard({ user, onLogout }) {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabPermissions = {
    'user': 'user:view',
    'project': ['project:view', 'project.view', 'view:project', 'view_project']
  };

  const requiredPermission = tabPermissions[activeTab];
  const isAuthorized = !requiredPermission || hasPermission(requiredPermission);

  // Backend API Users State
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Backend API Projects State
  const [projectsList, setProjectsList] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  const loadUsersFromApi = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await fetchUsersApi({ search: searchTerm });
      if (res && res.success && res.data) {
        setUsersList(Array.isArray(res.data) ? res.data : (res.data.results || []));
      } else if (res && Array.isArray(res.data)) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsersError(err.message || 'Error loading users');
    } finally {
      setUsersLoading(false);
    }
  }, [searchTerm]);

  const loadProjectsFromApi = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const res = await fetchProjectsApi();
      if (res && res.success && res.data) {
        setProjectsList(Array.isArray(res.data) ? res.data : (res.data.results || []));
      } else if (res && Array.isArray(res.data)) {
        setProjectsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setProjectsError(err.message || 'Error loading projects');
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'user') {
      loadUsersFromApi();
    } else if (activeTab === 'project') {
      loadProjectsFromApi();
    }
  }, [activeTab, loadUsersFromApi, loadProjectsFromApi]);

  const userName = user?.name || user?.username || 'Employee User';

  return (
    <EmployeeLayout
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="relative min-h-full p-6 sm:p-8 flex flex-col gap-6 items-center">
        {/* Ambient Lighting Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-emerald-200/70 -top-28 -right-24"></div>
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-teal-200/70 -bottom-36 -left-20"></div>
        </div>

        {!isAuthorized ? (
          <div className="relative z-10 w-full flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <AccessRestricted onReturn={() => setActiveTab('dashboard')} />
          </div>
        ) : (
          <>
            {/* 1. USER MANAGEMENT TAB */}
            {activeTab === 'user' && (
              <div className="relative z-10 w-full max-w-[1350px]">
                <UserManagement
                  usersList={usersList}
                  loading={usersLoading}
                  error={usersError}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onRefresh={loadUsersFromApi}
                />
              </div>
            )}

            {/* 2. PROJECT MANAGEMENT TAB */}
            {activeTab === 'project' && (
              <div className="relative z-10 w-full max-w-[1350px]">
                <ProjectManagement
                  projects={projectsList}
                  loading={projectsLoading}
                  error={projectsError}
                  onRefresh={loadProjectsFromApi}
                />
              </div>
            )}

            {/* 3. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <main className="relative z-10 w-full max-w-[1350px] flex flex-col gap-6">
                {/* Hero Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 m-0">Good Day, {userName.split(' ')[0]}! 👋</h1>
                    <p className="text-sm text-slate-500 mt-1">Here is your daily work summary, attendance status, and pending tasks.</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg">📅</div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">96.8%</div>
                    <div className="text-xs text-slate-400">21 Days Present this month</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-slate-500">Leave Balance</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">🏖️</div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">14 Days</div>
                    <div className="text-xs text-slate-400">10 Paid / 4 Sick leaves available</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-semibold text-slate-500">Work Hours Logged</span>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">⏱️</div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">38.5 hrs</div>
                    <div className="text-xs text-slate-400">Target: 40.0 hrs / week</div>
                  </div>
                </div>

                {/* Announcements Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm w-full">
                  <div className="mb-4 pb-3 border-b border-slate-100">
                    <span className="text-lg font-bold text-slate-900 flex items-center gap-2">📢 Announcements</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                      <div className="font-semibold text-sm text-slate-900">Annual All-Hands Meeting</div>
                      <div className="text-xs text-slate-500 mt-1">Aug 25 at 10:00 AM • Main Auditorium & Virtual</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-600">
                      <div className="font-semibold text-sm text-slate-900">Q3 Performance Appraisals</div>
                      <div className="text-xs text-slate-500 mt-1">Self-evaluation portal opens Sep 01</div>
                    </div>
                  </div>
                </div>
              </main>
            )}
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
