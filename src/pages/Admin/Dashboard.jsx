import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BodyContent from '../../components/Dashboard/BodyContent';
import Settings from './Settings';
import { fetchUsersApi } from '../../api/admin/userApi';
import { fetchRolesApi } from '../../api/admin/roleApi';
import UserFormModal from '../../components/User/UserFormModal';
import RoleFormModal from '../../components/Role/RoleFormModal';

export default function AdminDashboard({ user, onLogout, activeTabFromRoute }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    const path = location.pathname.replace('/', '').toLowerCase();
    const validTabs = ['overview', 'user', 'project', 'department', 'role', 'settings'];
    if (validTabs.includes(path)) {
      return path;
    }
    return activeTabFromRoute || 'user';
  };

  const activeTab = getTabFromPath();

  const handleTabChange = (newTab) => {
    navigate(`/${newTab}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isActiveFilter, setIsActiveFilter] = useState('all');

  // Backend API User List state
  const [usersList, setUsersList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // Fetch users from backend API (/api/user/) with filter parameters
  const loadUsersFromApi = useCallback(async (pageOverride) => {
    setUsersLoading(true);
    setUsersError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : currentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: searchTerm,
        role: roleFilter,
        is_active: isActiveFilter
      };
      const res = await fetchUsersApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setUsersList(res.data);
          setPaginationInfo(null);
        } else if (res.data.results) {
          setUsersList(Array.isArray(res.data.results) ? res.data.results : []);
          setPaginationInfo(res.data.pagination || null);
        } else {
          setUsersList([]);
          setPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setUsersList(res.data);
        setPaginationInfo(null);
      } else {
        if (res && res.message) {
          setUsersError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsersError(err.message || 'Unable to connect to /api/user/ endpoint');
    } finally {
      setUsersLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, isActiveFilter]);

  // Backend API Role List state
  const [rolesList, setRolesList] = useState([]);
  const [rolesPaginationInfo, setRolesPaginationInfo] = useState(null);
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // Fetch roles from backend API (/api/role/)
  const loadRolesFromApi = useCallback(async (pageOverride) => {
    setRolesLoading(true);
    setRolesError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : rolesCurrentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: roleSearchTerm
      };
      const res = await fetchRolesApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setRolesList(res.data);
          setRolesPaginationInfo(null);
        } else if (res.data.results) {
          setRolesList(Array.isArray(res.data.results) ? res.data.results : []);
          setRolesPaginationInfo(res.data.pagination || null);
        } else {
          setRolesList([]);
          setRolesPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setRolesList(res.data);
        setRolesPaginationInfo(null);
      } else {
        if (res && res.message) {
          setRolesError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
      setRolesError(err.message || 'Unable to connect to /api/role/ endpoint');
    } finally {
      setRolesLoading(false);
    }
  }, [rolesCurrentPage, roleSearchTerm]);

  useEffect(() => {
    if (activeTab === 'user' || activeTab === 'overview') {
      loadUsersFromApi();
    }
    if (activeTab === 'role' || activeTab === 'overview') {
      loadRolesFromApi();
    }
  }, [activeTab, loadUsersFromApi, loadRolesFromApi]);

  const handleRolesPageChange = (newPage) => {
    setRolesCurrentPage(newPage);
    loadRolesFromApi(newPage);
  };

  const handleRoleSearchChange = (val) => {
    setRoleSearchTerm(val);
    setRolesCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadUsersFromApi(newPage);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (val) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleIsActiveFilterChange = (val) => {
    setIsActiveFilter(val);
    setCurrentPage(1);
  };

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddProjModal, setShowAddProjModal] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Sample Users / Employees Data
  const [employees, setEmployees] = useState([
    { id: 101, name: 'Sarah Connor', email: 'sarah.c@company.com', role: 'Engineering Lead', department: 'Engineering', status: 'Present', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=4f46e5&color=fff' },
    { id: 102, name: 'Michael Scott', email: 'm.scott@company.com', role: 'Regional Manager', department: 'Management', status: 'Present', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=7c3aed&color=fff' },
    { id: 103, name: 'Pam Beesly', email: 'pam.b@company.com', role: 'HR Manager', department: 'Human Resources', status: 'Remote', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Pam+Beesly&background=ec4899&color=fff' },
    { id: 104, name: 'Jim Halpert', email: 'jim.h@company.com', role: 'Sales Lead', department: 'Sales', status: 'On Leave', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Jim+Halpert&background=0284c7&color=fff' },
    { id: 105, name: 'Dwight Schrute', email: 'dwight.s@company.com', role: 'Sr. Sales Rep', department: 'Sales', status: 'Present', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Dwight+Schrute&background=059669&color=fff' },
    { id: 106, name: 'Angela Martin', email: 'angela.m@company.com', role: 'Senior Accountant', department: 'Finance', status: 'Present', accountStatus: 'Active', avatar: 'https://ui-avatars.com/api/?name=Angela+Martin&background=d97706&color=fff' },
    { id: 107, name: 'Ryan Howard', email: 'ryan.h@company.com', role: 'Product Manager', department: 'Engineering', status: 'Offline', accountStatus: 'Inactive', avatar: 'https://ui-avatars.com/api/?name=Ryan+Howard&background=64748b&color=fff' }
  ]);

  // Sample Projects Data
  const [projects, setProjects] = useState([
    { id: 1, name: 'WorkPulse Mobile App V2', lead: 'Sarah Connor', progress: 75, status: 'In Progress', dept: 'Engineering', deadline: 'Aug 30, 2026', budget: '$45,000' },
    { id: 2, name: 'Automated Payroll Engine', lead: 'Angela Martin', progress: 90, status: 'Testing', dept: 'Finance', deadline: 'Aug 20, 2026', budget: '$28,000' },
    { id: 3, name: 'Q3 Enterprise Sales CRM Integrations', lead: 'Jim Halpert', progress: 40, status: 'In Progress', dept: 'Sales', deadline: 'Sep 15, 2026', budget: '$35,000' },
    { id: 4, name: 'Employee Wellness & Benefits Portal', lead: 'Pam Beesly', progress: 100, status: 'Completed', dept: 'Human Resources', deadline: 'Jul 31, 2026', budget: '$15,000' }
  ]);

  // Sample Roles Data
  const [roles] = useState([
    { id: 1, title: 'Super Administrator', usersCount: 2, permissions: ['Full System Access', 'Manage Roles', 'Payroll Control', 'Audit Logs'], level: 'Level 1' },
    { id: 2, title: 'Department Manager', usersCount: 5, permissions: ['Team Management', 'Approve Leaves', 'Assign Projects', 'Reports'], level: 'Level 2' },
    { id: 3, title: 'HR Officer', usersCount: 3, permissions: ['Employee Onboarding', 'Leave Records', 'Policy Updates'], level: 'Level 2' },
    { id: 4, title: 'Team Lead', usersCount: 8, permissions: ['Project Sprint Review', 'Attendance Monitoring', 'Tasks'], level: 'Level 3' },
    { id: 5, title: 'Standard Employee', usersCount: 130, permissions: ['Punch Clock In/Out', 'Apply Leave', 'View Tasks'], level: 'Level 4' }
  ]);

  // Form Inputs
  const [newProjName, setNewProjName] = useState('');
  const [newProjLead, setNewProjLead] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleUserCreated = (newUser) => {
    const createdUserObj = newUser.user || newUser;
    const fullName = [createdUserObj.first_name, createdUserObj.last_name].filter(Boolean).join(' ') || createdUserObj.username;
    
    const formattedUser = {
      id: createdUserObj.id || Date.now(),
      username: createdUserObj.username || 'user',
      email: createdUserObj.email || '',
      first_name: createdUserObj.first_name || '',
      last_name: createdUserObj.last_name || '',
      phone: createdUserObj.phone || '',
      company: createdUserObj.company || 1,
      company_name: createdUserObj.company_name || 'TechCorp',
      role: createdUserObj.role || 1,
      role_name: createdUserObj.role_name || (createdUserObj.role === 1 ? 'super_admin' : createdUserObj.role === 2 ? 'admin' : createdUserObj.role === 3 ? 'hr' : 'employee'),
      is_active: createdUserObj.is_active ?? true,
      created_at: createdUserObj.created_at || new Date().toISOString(),
      updated_at: createdUserObj.updated_at || new Date().toISOString()
    };

    setUsersList((prev) => [formattedUser, ...prev]);

    const createdEmp = {
      id: formattedUser.id,
      name: fullName,
      email: formattedUser.email,
      role: formattedUser.role_name,
      department: 'Engineering',
      status: 'Offline',
      accountStatus: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4f46e5&color=fff`
    };

    setEmployees((prev) => [createdEmp, ...prev]);
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjName) return;
    const newProj = {
      id: Date.now(),
      name: newProjName,
      lead: newProjLead || 'Sarah Connor',
      progress: 10,
      status: 'In Progress',
      dept: 'Engineering',
      deadline: 'Oct 15, 2026',
      budget: '$25,000'
    };
    setProjects([newProj, ...projects]);
    setShowAddProjModal(false);
    setNewProjName('');
    setNewProjLead('');
    triggerToast(`Created new project initiative: ${newProjName}`);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const adminName = user?.name || user?.username || 'Admin User';

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      {activeTab === 'settings' ? (
        <Settings triggerToast={triggerToast} />
      ) : (
        <BodyContent
          activeTab={activeTab}
          adminName={adminName}
          toastMessage={toastMessage}
          employees={employees}
          filteredEmployees={filteredEmployees}
          projects={projects}
          roles={roles}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          usersList={usersList}
          paginationInfo={paginationInfo}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          usersLoading={usersLoading}
          usersError={usersError}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          roleFilter={roleFilter}
          setRoleFilter={handleRoleFilterChange}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={handleIsActiveFilterChange}
          onRefreshUsers={() => loadUsersFromApi(currentPage)}
          rolesList={rolesList}
          rolesPaginationInfo={rolesPaginationInfo}
          rolesCurrentPage={rolesCurrentPage}
          onRolesPageChange={handleRolesPageChange}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          roleSearchTerm={roleSearchTerm}
          setRoleSearchTerm={handleRoleSearchChange}
          onRefreshRoles={() => loadRolesFromApi(rolesCurrentPage)}
          triggerToast={triggerToast}
          setShowAddUserModal={setShowAddUserModal}
          setShowAddProjModal={setShowAddProjModal}
          setShowAddRoleModal={setShowAddRoleModal}
        />
      )}

      {/* Onboard User Modal */}
      <UserFormModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserCreated={handleUserCreated}
        triggerToast={triggerToast}
      />

      {/* Define Role Modal */}
      <RoleFormModal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        onRoleCreated={(newRole) => setRolesList((prev) => [newRole, ...prev])}
        triggerToast={triggerToast}
      />

      {/* Create Project Modal */}
      {showAddProjModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-7 text-slate-900 shadow-2xl animate-cardFadeUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Create New Project Initiative</h3>
              <button className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer" onClick={() => setShowAddProjModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Project Title</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Analytics Engine V2"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Project Lead</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Sarah Connor"
                  value={newProjLead}
                  onChange={(e) => setNewProjLead(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  onClick={() => setShowAddProjModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
