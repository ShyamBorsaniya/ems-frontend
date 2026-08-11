import React from 'react';
import UserManagement from '../../components/User/UserManagement';

export default function Users({ employees, filteredEmployees, deptFilter, setDeptFilter, triggerToast, setShowAddUserModal }) {
  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      <UserManagement
        filteredEmployees={filteredEmployees}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        triggerToast={triggerToast}
        setShowAddUserModal={setShowAddUserModal}
      />
    </div>
  );
}
