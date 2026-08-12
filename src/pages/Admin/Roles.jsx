import React from 'react';
import RoleManagement from '../../components/Role/RoleManagement';

export default function Roles(props) {
  return (
    <div className="p-6 sm:p-8">
      <RoleManagement {...props} />
    </div>
  );
}
