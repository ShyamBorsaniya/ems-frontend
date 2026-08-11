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

      {/* Hero Banner Header */}
      <div className="admin-hero-card">
        <div className="admin-hero-text">
          <h1>Welcome, {adminName.split(' ')[0]} 👋</h1>
          <p>WorkPulse Management Console — Streamlining users, projects, departments, and roles.</p>
        </div>

        <div className="admin-hero-actions">
          {activeTab === 'user' && (
            <button className="admin-btn-primary" onClick={() => setShowAddUserModal(true)}>
              <span>+</span> Onboard User
            </button>
          )}
          {activeTab === 'project' && (
            <button className="admin-btn-primary" onClick={() => setShowAddProjModal(true)}>
              <span>+</span> Create Project
            </button>
          )}
          {activeTab === 'role' && (
            <button className="admin-btn-primary" onClick={() => setShowAddRoleModal(true)}>
              <span>+</span> Define Role
            </button>
          )}
          <button className="admin-btn-secondary" onClick={() => triggerToast('Exporting Report (CSV)...')}>
            📥 Export Statement
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Total Users</span>
            <div className="admin-stat-icon stat-icon-indigo">👥</div>
          </div>
          <div className="admin-stat-value">{employees.length} Active</div>
          <div className="admin-stat-subtext">Across 5 Departments</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Active Projects</span>
            <div className="admin-stat-icon stat-icon-cyan">🚀</div>
          </div>
          <div className="admin-stat-value">{projects.length} Initiatives</div>
          <div className="admin-stat-subtext">{projects.filter(p => p.status === 'In Progress').length} In Progress</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-title">Configured Roles</span>
            <div className="admin-stat-icon stat-icon-amber">🔑</div>
          </div>
          <div className="admin-stat-value">{roles.length} Tiered Roles</div>
          <div className="admin-stat-subtext">Access Matrix Enforced</div>
        </div>
      </div>

      {/* 1. SEPARATE USER COMPONENT */}
      {activeTab === 'user' && (
        <UserManagement
          filteredEmployees={filteredEmployees}
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          triggerToast={triggerToast}
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
          employeesCount={employees.length}
          projectsCount={projects.length}
        />
      )}
    </main>
  );
}
