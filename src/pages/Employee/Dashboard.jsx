import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import UserManagement from '../../components/User/UserManagement';
import ProjectManagement from '../../components/Project/ProjectManagement';
import MyProfile from '../../components/Profile/MyProfile';
import AccessRestricted from '../../components/common/AccessRestricted';
import { fetchUsersApi } from '../../api/admin/userApi';
import { fetchProjectsApi } from '../../api/admin/projectApi';
import { useAuth } from '../../hooks/useAuth';

export default function EmployeeDashboard({ user, onLogout }) {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/employee/user' || path === '/employee/users') {
      return 'user';
    }
    if (path === '/employee/project' || path === '/employee/projects') {
      return 'project';
    }
    if (path === '/employee/profile' || path === '/employee/my-profile') {
      return 'profile';
    }
    return 'dashboard';
  };

  const activeTab = getTabFromPath();
  const lastTabRef = useRef(null);

  const handleTabChange = (newTab) => {
    if (newTab === 'dashboard') {
      navigate('/employee');
    } else {
      navigate(`/employee/${newTab}`);
    }
  };

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

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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
      if (lastTabRef.current !== 'user') {
        loadUsersFromApi();
        lastTabRef.current = 'user';
      }
    } else if (activeTab === 'project') {
      if (lastTabRef.current !== 'project') {
        loadProjectsFromApi();
        lastTabRef.current = 'project';
      }
    } else {
      lastTabRef.current = activeTab;
    }
  }, [activeTab, loadUsersFromApi, loadProjectsFromApi]);

  const userName = user?.name || user?.username || 'Employee User';

  return (
    <EmployeeLayout
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <div className="relative min-h-full p-6 sm:p-8 flex flex-col gap-6 items-center">
        {/* Ambient Lighting Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[500px] h-[500px] bg-emerald-200/70 -top-28 -right-24"></div>
          <div className="absolute rounded-full blur-[140px] opacity-35 w-[450px] h-[450px] bg-teal-200/70 -bottom-36 -left-20"></div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2 animate-bounce">
            <span>✓</span> {toastMessage}
          </div>
        )}

        {!isAuthorized ? (
          <div className="relative z-10 w-full flex-1 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <AccessRestricted onReturn={() => handleTabChange('dashboard')} />
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

              </main>
            )}

            {/* 4. MY PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="relative z-10 w-full max-w-[1350px]">
                <MyProfile triggerToast={triggerToast} readOnly={true} />
              </div>
            )}
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
