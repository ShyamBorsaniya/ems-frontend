import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BodyContent from '../../components/Dashboard/BodyContent';
import Settings from './Settings';

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

  // Form Inputs
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
          triggerToast={triggerToast}
          setShowAddUserModal={setShowAddUserModal}
          setShowAddProjModal={setShowAddProjModal}
          setShowAddRoleModal={setShowAddRoleModal}
        />
      )}

      {/* Onboard User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-7 text-slate-900 shadow-2xl animate-cardFadeUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Onboard New User</h3>
              <button className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Eleanor Vance"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Work Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. eleanor@company.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Role Title</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Department</label>
                  <select
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
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

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-7 text-slate-900 shadow-2xl animate-cardFadeUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Define New Enterprise Role</h3>
              <button className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer" onClick={() => setShowAddRoleModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddRoleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Role Title</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  placeholder="e.g. Senior Tech Lead"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Role Scope & Description</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  rows="3"
                  placeholder="Provide scope of permissions..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  onClick={() => setShowAddRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
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
