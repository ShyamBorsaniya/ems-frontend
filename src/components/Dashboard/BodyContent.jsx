import React from 'react';
import UserManagement from '../User/UserManagement';
import PendingUserManagement from '../User/PendingUserManagement';
import ProjectManagement from '../Project/ProjectManagement';
import DepartmentManagement from '../Department/DepartmentManagement';
import RoleManagement from '../Role/RoleManagement';
import OverviewSummary from '../Overview/OverviewSummary';

export default function BodyContent({
  activeTab,
  adminName,
  toastMessage,
  employees,
  filteredEmployees,
  projects,
  roles,
  deptFilter,
  setDeptFilter,
  usersList,
  paginationInfo,
  currentPage,
  onPageChange,
  usersLoading,
  usersError,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  isActiveFilter,
  setIsActiveFilter,
  onRefreshUsers,
  pendingUsersList = [],
  pendingUsersPaginationInfo = null,
  pendingUsersCurrentPage = 1,
  onPendingUsersPageChange,
  pendingUsersLoading = false,
  pendingUsersError = null,
  pendingUsersSearchTerm = '',
  setPendingUsersSearchTerm,
  onApprovePendingUser,
  onRejectPendingUser,
  rolesList = [],
  rolesPaginationInfo = null,
  rolesCurrentPage = 1,
  onRolesPageChange,
  rolesLoading = false,
  rolesError = null,
  roleSearchTerm = '',
  setRoleSearchTerm,
  onRefreshRoles,
  deptsList = [],
  deptsPaginationInfo = null,
  deptsCurrentPage = 1,
  onDeptsPageChange,
  deptsLoading = false,
  deptsError = null,
  deptSearchTerm = '',
  setDeptSearchTerm,
  deptStatusFilter = 'all',
  setDeptStatusFilter,
  onRefreshDepts,
  projectsList = [],
  projectsPaginationInfo = null,
  projectsCurrentPage = 1,
  onProjectsPageChange,
  projectsLoading = false,
  projectsError = null,
  projectSearchTerm = '',
  setProjectSearchTerm,
  projectStatusFilter = 'all',
  setProjectStatusFilter,
  projectPriorityFilter = 'all',
  setProjectPriorityFilter,
  onRefreshProjects,
  triggerToast,
  setShowAddUserModal,
  setShowAddProjModal,
  setShowAddRoleModal,
  setShowAddDeptModal
}) {
  return (
    <main className="relative z-10 w-full flex-1 overflow-y-auto p-6 sm:p-8 box-border flex flex-col gap-8 items-center">
      <div className="w-full max-w-[1350px]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2 animate-bounce">
            <span>✓</span> {toastMessage}
          </div>
        )}

        {/* 1. SEPARATE USER COMPONENT */}
        {activeTab === 'user' && (
          <UserManagement
            usersList={usersList}
            paginationInfo={paginationInfo}
            currentPage={currentPage}
            onPageChange={onPageChange}
            loading={usersLoading}
            error={usersError}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            isActiveFilter={isActiveFilter}
            setIsActiveFilter={setIsActiveFilter}
            onRefresh={onRefreshUsers}
            filteredEmployees={filteredEmployees}
            deptFilter={deptFilter}
            setDeptFilter={setDeptFilter}
            triggerToast={triggerToast}
            setShowAddUserModal={setShowAddUserModal}
          />
        )}

        {/* 1.1 PENDING USER COMPONENT */}
        {activeTab === 'pending-users' && (
          <PendingUserManagement
            pendingUsersList={pendingUsersList}
            paginationInfo={pendingUsersPaginationInfo}
            currentPage={pendingUsersCurrentPage}
            onPageChange={onPendingUsersPageChange}
            loading={pendingUsersLoading}
            error={pendingUsersError}
            searchTerm={pendingUsersSearchTerm}
            setSearchTerm={setPendingUsersSearchTerm}
            onApprove={onApprovePendingUser}
            onReject={onRejectPendingUser}
            triggerToast={triggerToast}
          />
        )}

        {/* 2. SEPARATE PROJECT COMPONENT */}
        {activeTab === 'project' && (
          <ProjectManagement
            projects={projectsList.length > 0 ? projectsList : projects}
            paginationInfo={projectsPaginationInfo}
            currentPage={projectsCurrentPage}
            onPageChange={onProjectsPageChange}
            loading={projectsLoading}
            error={projectsError}
            searchTerm={projectSearchTerm}
            setSearchTerm={setProjectSearchTerm}
            statusFilter={projectStatusFilter}
            setStatusFilter={setProjectStatusFilter}
            priorityFilter={projectPriorityFilter}
            setPriorityFilter={setProjectPriorityFilter}
            departments={deptsList}
            employees={usersList.length > 0 ? usersList : employees}
            onRefresh={onRefreshProjects}
            triggerToast={triggerToast}
            setShowAddProjModal={setShowAddProjModal}
          />
        )}

        {/* 3. SEPARATE DEPARTMENT COMPONENT */}
        {activeTab === 'department' && (
          <DepartmentManagement
            departments={deptsList}
            paginationInfo={deptsPaginationInfo}
            currentPage={deptsCurrentPage}
            onPageChange={onDeptsPageChange}
            loading={deptsLoading}
            error={deptsError}
            searchTerm={deptSearchTerm}
            setSearchTerm={setDeptSearchTerm}
            isActiveFilter={deptStatusFilter}
            setIsActiveFilter={setDeptStatusFilter}
            onRefresh={onRefreshDepts}
            setShowAddDeptModal={setShowAddDeptModal}
            triggerToast={triggerToast}
          />
        )}

        {/* 4. SEPARATE ROLE COMPONENT */}
        {activeTab === 'role' && (
          <RoleManagement
            roles={rolesList.length > 0 ? rolesList : roles}
            paginationInfo={rolesPaginationInfo}
            currentPage={rolesCurrentPage}
            onPageChange={onRolesPageChange}
            loading={rolesLoading}
            error={rolesError}
            searchTerm={roleSearchTerm}
            setSearchTerm={setRoleSearchTerm}
            onRefresh={onRefreshRoles}
            setShowAddRoleModal={setShowAddRoleModal}
            triggerToast={triggerToast}
          />
        )}

        {/* 5. SEPARATE OVERVIEW COMPONENT */}
        {activeTab === 'overview' && (
          <OverviewSummary
            adminName={adminName}
            employees={employees}
            projects={projects}
            roles={roles}
            triggerToast={triggerToast}
          />
        )}
      </div>
    </main>
  );
}
