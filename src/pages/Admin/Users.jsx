import React from 'react';
import UserManagement from '../../components/User/UserManagement';

export default function Users(props) {
  return (
    <div className="p-6 sm:p-8">
      <UserManagement {...props} />
    </div>
  );
}
