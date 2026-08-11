import React from 'react';
import UserManagement from '../User/UserManagement';
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
  triggerToast,
  setShowAddUserModal,
  setShowAddProjModal,
  setShowAddRoleModal
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

        {/* 2. SEPARATE PROJECT COMPONENT */}
        {activeTab === 'project' && (
          <ProjectManagement
            projects={projects}
            setShowAddProjModal={setShowAddProjModal}
          />
        )}

        {/* 3. SEPARATE DEPARTMENT COMPONENT */}
        {activeTab === 'department' && (
          <DepartmentManagement />
        )}

        {/* 4. SEPARATE ROLE COMPONENT */}
        {activeTab === 'role' && (
          <RoleManagement
            roles={roles}
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
