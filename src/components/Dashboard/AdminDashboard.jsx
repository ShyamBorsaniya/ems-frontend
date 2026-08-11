import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BodyContent from './BodyContent';
import './AdminDashboard.css';

export default function AdminDashboard({ user, onLogout, activeTabFromRoute }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive activeTab from current URL pathname e.g. "/user", "/project", etc.
  const getTabFromPath = () => {
    const path = location.pathname.replace('/', '').toLowerCase();
    const validTabs = ['overview', 'user', 'project', 'department', 'role'];
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
  const [roles, setRoles] = useState([
    { id: 1, title: 'Super Administrator', usersCount: 2, permissions: ['Full System Access', 'Manage Roles', 'Payroll Control', 'Audit Logs'], level: 'Level 1' },
    { id: 2, title: 'Department Manager', usersCount: 5, permissions: ['Team Management', 'Approve Leaves', 'Assign Projects', 'Reports'], level: 'Level 2' },
    { id: 3, title: 'HR Officer', usersCount: 3, permissions: ['Employee Onboarding', 'Leave Records', 'Policy Updates'], level: 'Level 2' },
    { id: 4, title: 'Team Lead', usersCount: 8, permissions: ['Project Sprint Review', 'Attendance Monitoring', 'Tasks'], level: 'Level 3' },
    { id: 5, title: 'Standard Employee', usersCount: 130, permissions: ['Punch Clock In/Out', 'Apply Leave', 'View Tasks'], level: 'Level 4' }
  ]);

  // New Form Inputs
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Software Engineer');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');

  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const [newProjName, setNewProjName] = useState('');
  const [newProjLead, setNewProjLead] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;

    const createdEmp = {
      id: Date.now(),
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      department: newEmpDept,
      status: 'Offline',
      accountStatus: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmpName)}&background=4f46e5&color=fff`
    };

    setEmployees([createdEmp, ...employees]);
    setShowAddUserModal(false);
    setNewEmpName('');
    setNewEmpEmail('');
    triggerToast(`Successfully onboarded ${newEmpName} into ${newEmpDept}!`);
  };

  const handleAddRoleSubmit = (e) => {
    e.preventDefault();
    if (!newRoleTitle) return;
    const newRole = {
      id: Date.now(),
      title: newRoleTitle,
      usersCount: 0,
      permissions: ['Custom Permission Set', 'Standard Portal Access'],
      level: 'Custom'
    };
    setRoles([...roles, newRole]);
    setShowAddRoleModal(false);
    setNewRoleTitle('');
    setNewRoleDesc('');
    triggerToast(`Created new enterprise role: ${newRoleTitle}`);
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

  // Filtered employees list based on search and department filter
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const adminName = user?.name || user?.username || 'Admin User';

  return (
    <div className="admin-dashboard-wrapper">
      {/* Ambient Background Orbs */}
      <div className="admin-ambient-bg">
        <div className="admin-orb admin-orb-1"></div>
        <div className="admin-orb admin-orb-2"></div>
      </div>

      {/* 1. SEPARATE SIDE PANEL COMPONENT */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        employeesCount={employees.length}
        projectsCount={projects.length}
        rolesCount={roles.length}
        user={user}
        onLogout={onLogout}
      />

      {/* RIGHT AREA */}
      <div className="admin-main-wrapper">
        {/* 2. SEPARATE TOPBAR COMPONENT */}
        <Topbar
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* 3. SEPARATE BODY CONTENT COMPONENT */}
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
          triggerToast={triggerToast}
          setShowAddUserModal={setShowAddUserModal}
          setShowAddProjModal={setShowAddProjModal}
          setShowAddRoleModal={setShowAddRoleModal}
        />
      </div>

      {/* Onboard User Modal */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '500px', background: '#ffffff',
            border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '1.75rem', color: '#0f172a', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Onboard New User</h3>
              <button
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={() => setShowAddUserModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Full Name</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="e.g. Eleanor Vance"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Work Email</label>
                <input
                  type="email"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="e.g. eleanor@company.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Role Title</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Department</label>
                  <select
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Define Role Modal */}
      {showAddRoleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '480px', background: '#ffffff',
            border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '1.75rem', color: '#0f172a', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Define New Enterprise Role</h3>
              <button
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={() => setShowAddRoleModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Role Title</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="e.g. Senior Tech Lead"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Role Scope & Description</label>
                <textarea
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  rows="3"
                  placeholder="Provide scope of permissions..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => setShowAddRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showAddProjModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '480px', background: '#ffffff',
            border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '1.75rem', color: '#0f172a', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Create New Project Initiative</h3>
              <button
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}
                onClick={() => setShowAddProjModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Project Title</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="e.g. Analytics Engine V2"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#475569', display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Project Lead</label>
                <input
                  type="text"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="e.g. Sarah Connor"
                  value={newProjLead}
                  onChange={(e) => setNewProjLead(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => setShowAddProjModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
