import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BodyContent from '../../components/Dashboard/BodyContent';
import { fetchUsersApi, fetchPendingUsersApi, approveUserApi, rejectUserApi } from '../../api/admin/userApi';
import { fetchRolesApi } from '../../api/admin/roleApi';
import { fetchDepartmentsApi } from '../../api/admin/departmentApi';
import { fetchProjectsApi } from '../../api/admin/projectApi';
import { fetchDesignationsApi } from '../../api/admin/designationApi';
import UserFormModal from '../../components/User/UserFormModal';
import RoleFormModal from '../../components/Role/RoleFormModal';
import DepartmentFormModal from '../../components/Department/DepartmentFormModal';
import ProjectFormModal from '../../components/Project/ProjectFormModal';

export default function AdminDashboard({ user, onLogout, activeTabFromRoute }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    const path = location.pathname.replace('/', '').toLowerCase();
    const validTabs = ['overview', 'user', 'pending-users', 'project', 'department', 'role', 'designation'];
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

  // Backend API Pending User List state
  const [pendingUsersList, setPendingUsersList] = useState([]);
  const [pendingUsersPaginationInfo, setPendingUsersPaginationInfo] = useState(null);
  const [pendingUsersCurrentPage, setPendingUsersCurrentPage] = useState(1);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(false);
  const [pendingUsersError, setPendingUsersError] = useState(null);
  const [pendingUsersSearchTerm, setPendingUsersSearchTerm] = useState('');

  // Fetch pending users from backend API (/api/user/pending/)
  const loadPendingUsersFromApi = useCallback(async (pageOverride) => {
    setPendingUsersLoading(true);
    setPendingUsersError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : pendingUsersCurrentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: pendingUsersSearchTerm
      };
      const res = await fetchPendingUsersApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setPendingUsersList(res.data);
          setPendingUsersPaginationInfo(null);
        } else if (res.data.results) {
          setPendingUsersList(Array.isArray(res.data.results) ? res.data.results : []);
          setPendingUsersPaginationInfo(res.data.pagination || null);
        } else {
          setPendingUsersList([]);
          setPendingUsersPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setPendingUsersList(res.data);
        setPendingUsersPaginationInfo(null);
      } else {
        if (res && res.message) {
          setPendingUsersError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load pending users:', err);
      setPendingUsersError(err.message || 'Unable to connect to /api/user/pending/ endpoint');
    } finally {
      setPendingUsersLoading(false);
    }
  }, [pendingUsersCurrentPage, pendingUsersSearchTerm]);

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

  // Backend API Department List state
  const [deptsList, setDeptsList] = useState([]);
  const [deptsPaginationInfo, setDeptsPaginationInfo] = useState(null);
  const [deptsCurrentPage, setDeptsCurrentPage] = useState(1);
  const [deptsLoading, setDeptsLoading] = useState(false);
  const [deptsError, setDeptsError] = useState(null);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');
  const [deptStatusFilter, setDeptStatusFilter] = useState('all');

  // Fetch departments from backend API (/api/department/)
  const loadDepartmentsFromApi = useCallback(async (pageOverride) => {
    setDeptsLoading(true);
    setDeptsError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : deptsCurrentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: deptSearchTerm,
        is_active: deptStatusFilter
      };
      const res = await fetchDepartmentsApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setDeptsList(res.data);
          setDeptsPaginationInfo(null);
        } else if (res.data.results) {
          setDeptsList(Array.isArray(res.data.results) ? res.data.results : []);
          setDeptsPaginationInfo(res.data.pagination || null);
        } else {
          setDeptsList([]);
          setDeptsPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setDeptsList(res.data);
        setDeptsPaginationInfo(null);
      } else {
        if (res && res.message) {
          setDeptsError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
      setDeptsError(err.message || 'Unable to connect to /api/department/ endpoint');
    } finally {
      setDeptsLoading(false);
    }
  }, [deptsCurrentPage, deptSearchTerm, deptStatusFilter]);

  // Backend API Project List state
  const [projectsList, setProjectsList] = useState([]);
  const [projectsPaginationInfo, setProjectsPaginationInfo] = useState(null);
  const [projectsCurrentPage, setProjectsCurrentPage] = useState(1);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [projectPriorityFilter, setProjectPriorityFilter] = useState('all');

  // Fetch projects from backend API (/api/project/)
  const loadProjectsFromApi = useCallback(async (pageOverride) => {
    setProjectsLoading(true);
    setProjectsError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : projectsCurrentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: projectSearchTerm,
        status: projectStatusFilter,
        priority: projectPriorityFilter
      };
      const res = await fetchProjectsApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setProjectsList(res.data);
          setProjectsPaginationInfo(null);
        } else if (res.data.results) {
          setProjectsList(Array.isArray(res.data.results) ? res.data.results : []);
          setProjectsPaginationInfo(res.data.pagination || null);
        } else {
          setProjectsList([]);
          setProjectsPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setProjectsList(res.data);
        setProjectsPaginationInfo(null);
      } else {
        if (res && res.message) {
          setProjectsError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setProjectsError(err.message || 'Unable to connect to /api/project/ endpoint');
    } finally {
      setProjectsLoading(false);
    }
  }, [projectsCurrentPage, projectSearchTerm, projectStatusFilter, projectPriorityFilter]);

  // Backend API Designation List state
  const [designationsList, setDesignationsList] = useState([]);
  const [designationsPaginationInfo, setDesignationsPaginationInfo] = useState(null);
  const [designationsCurrentPage, setDesignationsCurrentPage] = useState(1);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [designationsError, setDesignationsError] = useState(null);
  const [designationSearchTerm, setDesignationSearchTerm] = useState('');

  // Fetch designations from backend API (/api/designation/)
  const loadDesignationsFromApi = useCallback(async (pageOverride) => {
    setDesignationsLoading(true);
    setDesignationsError(null);
    const pageToLoad = pageOverride !== undefined ? pageOverride : designationsCurrentPage;
    try {
      const filters = {
        page: pageToLoad,
        search: designationSearchTerm
      };
      const res = await fetchDesignationsApi(filters);
      if (res && res.success && res.data) {
        if (Array.isArray(res.data)) {
          setDesignationsList(res.data);
          setDesignationsPaginationInfo(null);
        } else if (res.data.results) {
          setDesignationsList(Array.isArray(res.data.results) ? res.data.results : []);
          setDesignationsPaginationInfo(res.data.pagination || null);
        } else {
          setDesignationsList([]);
          setDesignationsPaginationInfo(null);
        }
      } else if (res && Array.isArray(res.data)) {
        setDesignationsList(res.data);
        setDesignationsPaginationInfo(null);
      } else {
        if (res && res.message) {
          setDesignationsError(res.message);
        }
      }
    } catch (err) {
      console.error('Failed to load designations:', err);
      setDesignationsError(err.message || 'Unable to connect to /api/designation/ endpoint');
    } finally {
      setDesignationsLoading(false);
    }
  }, [designationsCurrentPage, designationSearchTerm]);

  useEffect(() => {
    if (activeTab === 'user' || activeTab === 'overview') {
      loadUsersFromApi();
    }
    if (activeTab === 'pending-users' || activeTab === 'overview') {
      loadPendingUsersFromApi();
    }
    if (activeTab === 'role' || activeTab === 'overview') {
      loadRolesFromApi();
    }
    if (activeTab === 'department' || activeTab === 'overview') {
      loadDepartmentsFromApi();
    }
    if (activeTab === 'project' || activeTab === 'overview') {
      loadProjectsFromApi();
    }
    if (activeTab === 'designation' || activeTab === 'overview') {
      loadDesignationsFromApi();
    }
  }, [activeTab, loadUsersFromApi, loadPendingUsersFromApi, loadRolesFromApi, loadDepartmentsFromApi, loadProjectsFromApi, loadDesignationsFromApi]);

  const handleRolesPageChange = (newPage) => {
    setRolesCurrentPage(newPage);
    loadRolesFromApi(newPage);
  };

  const handleRoleSearchChange = (val) => {
    setRoleSearchTerm(val);
    setRolesCurrentPage(1);
  };

  const handleDeptsPageChange = (newPage) => {
    setDeptsCurrentPage(newPage);
    loadDepartmentsFromApi(newPage);
  };

  const handleDeptSearchChange = (val) => {
    setDeptSearchTerm(val);
    setDeptsCurrentPage(1);
  };

  const handleDeptStatusFilterChange = (val) => {
    setDeptStatusFilter(val);
    setDeptsCurrentPage(1);
  };

  const handleProjectsPageChange = (newPage) => {
    setProjectsCurrentPage(newPage);
    loadProjectsFromApi(newPage);
  };

  const handleProjectSearchChange = (val) => {
    setProjectSearchTerm(val);
    setProjectsCurrentPage(1);
  };

  const handleProjectStatusFilterChange = (val) => {
    setProjectStatusFilter(val);
    setProjectsCurrentPage(1);
  };

  const handleProjectPriorityFilterChange = (val) => {
    setProjectPriorityFilter(val);
    setProjectsCurrentPage(1);
  };

  const handleDesignationsPageChange = (newPage) => {
    setDesignationsCurrentPage(newPage);
    loadDesignationsFromApi(newPage);
  };

  const handleDesignationSearchChange = (val) => {
    setDesignationSearchTerm(val);
    setDesignationsCurrentPage(1);
  };

  const handlePendingUsersPageChange = (newPage) => {
    setPendingUsersCurrentPage(newPage);
    loadPendingUsersFromApi(newPage);
  };

  const handlePendingUsersSearchChange = (val) => {
    setPendingUsersSearchTerm(val);
    setPendingUsersCurrentPage(1);
  };

  const handleApprovePendingUser = async (userId) => {
    const res = await approveUserApi(userId);
    if (res && (res.success !== false)) {
      triggerToast('User account approved successfully!');
      loadPendingUsersFromApi(pendingUsersCurrentPage);
      loadUsersFromApi(currentPage);
    } else {
      triggerToast(res?.message || 'Failed to approve user');
    }
  };

  const handleRejectPendingUser = async (userId) => {
    const res = await rejectUserApi(userId);
    if (res && (res.success !== false)) {
      triggerToast('User account rejected successfully!');
      loadPendingUsersFromApi(pendingUsersCurrentPage);
    } else {
      triggerToast(res?.message || 'Failed to reject user');
    }
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
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
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
  const [projects] = useState([
    { id: 1, name: 'WorkPulse Mobile App V2', lead: 'Sarah Connor', progress: 75, status: 'ACTIVE', dept: 'Engineering', deadline: 'Aug 30, 2026', budget: '$45,000' },
    { id: 2, name: 'Automated Payroll Engine', lead: 'Angela Martin', progress: 90, status: 'Testing', dept: 'Finance', deadline: 'Aug 20, 2026', budget: '$28,000' },
    { id: 3, name: 'Q3 Enterprise Sales CRM Integrations', lead: 'Jim Halpert', progress: 40, status: 'ACTIVE', dept: 'Sales', deadline: 'Sep 15, 2026', budget: '$35,000' },
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
        pendingUsersList={pendingUsersList}
        pendingUsersPaginationInfo={pendingUsersPaginationInfo}
        pendingUsersCurrentPage={pendingUsersCurrentPage}
        onPendingUsersPageChange={handlePendingUsersPageChange}
        pendingUsersLoading={pendingUsersLoading}
        pendingUsersError={pendingUsersError}
        pendingUsersSearchTerm={pendingUsersSearchTerm}
        setPendingUsersSearchTerm={handlePendingUsersSearchChange}
        onApprovePendingUser={handleApprovePendingUser}
        onRejectPendingUser={handleRejectPendingUser}
        rolesList={rolesList}
        rolesPaginationInfo={rolesPaginationInfo}
        rolesCurrentPage={rolesCurrentPage}
        onRolesPageChange={handleRolesPageChange}
        rolesLoading={rolesLoading}
        rolesError={rolesError}
        roleSearchTerm={roleSearchTerm}
        setRoleSearchTerm={handleRoleSearchChange}
        onRefreshRoles={() => loadRolesFromApi(rolesCurrentPage)}
        deptsList={deptsList}
        deptsPaginationInfo={deptsPaginationInfo}
        deptsCurrentPage={deptsCurrentPage}
        onDeptsPageChange={handleDeptsPageChange}
        deptsLoading={deptsLoading}
        deptsError={deptsError}
        deptSearchTerm={deptSearchTerm}
        setDeptSearchTerm={handleDeptSearchChange}
        deptStatusFilter={deptStatusFilter}
        setDeptStatusFilter={handleDeptStatusFilterChange}
        onRefreshDepts={() => loadDepartmentsFromApi(deptsCurrentPage)}
        projectsList={projectsList}
        projectsPaginationInfo={projectsPaginationInfo}
        projectsCurrentPage={projectsCurrentPage}
        onProjectsPageChange={handleProjectsPageChange}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
        projectSearchTerm={projectSearchTerm}
        setProjectSearchTerm={handleProjectSearchChange}
        projectStatusFilter={projectStatusFilter}
        setProjectStatusFilter={handleProjectStatusFilterChange}
        projectPriorityFilter={projectPriorityFilter}
        setProjectPriorityFilter={handleProjectPriorityFilterChange}
        onRefreshProjects={() => loadProjectsFromApi(projectsCurrentPage)}
        designationsList={designationsList}
        designationsPaginationInfo={designationsPaginationInfo}
        designationsCurrentPage={designationsCurrentPage}
        onDesignationsPageChange={handleDesignationsPageChange}
        designationsLoading={designationsLoading}
        designationsError={designationsError}
        designationSearchTerm={designationSearchTerm}
        setDesignationSearchTerm={handleDesignationSearchChange}
        onRefreshDesignations={() => loadDesignationsFromApi(designationsCurrentPage)}
        triggerToast={triggerToast}
        setShowAddUserModal={setShowAddUserModal}
        setShowAddProjModal={setShowAddProjModal}
        setShowAddRoleModal={setShowAddRoleModal}
        setShowAddDeptModal={setShowAddDeptModal}
      />

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

      {/* Create Department Modal */}
      <DepartmentFormModal
        isOpen={showAddDeptModal}
        onClose={() => setShowAddDeptModal(false)}
        onDepartmentCreated={(newDept) => setDeptsList((prev) => [newDept, ...prev])}
        triggerToast={triggerToast}
      />

      {/* Create Project Modal */}
      {showAddProjModal && (
        <ProjectFormModal
          isOpen={showAddProjModal}
          onClose={() => setShowAddProjModal(false)}
          onProjectCreated={(newProject) => {
            setProjectsList((prev) => [newProject, ...prev]);
            loadProjectsFromApi(projectsCurrentPage);
          }}
          departments={deptsList}
          employees={usersList.length > 0 ? usersList : employees}
          triggerToast={triggerToast}
        />
      )}
    </AdminLayout>
  );
}
