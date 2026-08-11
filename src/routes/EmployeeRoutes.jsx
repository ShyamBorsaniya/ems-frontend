import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeDashboard from '../pages/Employee/Dashboard';
import Profile from '../pages/Employee/Profile';
import Tasks from '../pages/Employee/Tasks';

export default function EmployeeRoutes({ user, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDashboard user={user} onLogout={onLogout} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  );
}
