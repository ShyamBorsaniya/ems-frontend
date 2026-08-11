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
  triggerToast,
  setShowAddUserModal,
  setShowAddProjModal,
  setShowAddRoleModal
}) {
  return (
    <main className="admin-main-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 99,
          background: '#059669',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* 1. SEPARATE USER COMPONENT */}
      {activeTab === 'user' && (
        <UserManagement
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
    </main>
  );
}
