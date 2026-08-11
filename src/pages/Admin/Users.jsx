import React from 'react';
import UserManagement from '../../components/User/UserManagement';

export default function Users({ employees, filteredEmployees, deptFilter, setDeptFilter, triggerToast, setShowAddUserModal }) {
  return (
    <div className="p-6 sm:p-8">
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
