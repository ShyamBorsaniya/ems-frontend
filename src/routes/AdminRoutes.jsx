import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';

export default function AdminRoutes({ user, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="user" />} />
      <Route path="/overview" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="overview" />} />
      <Route path="/user" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="user" />} />
      <Route path="/project" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="project" />} />
      <Route path="/department" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="department" />} />
      <Route path="/role" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="role" />} />
      <Route path="/settings" element={<AdminDashboard user={user} onLogout={onLogout} defaultTab="settings" />} />
    </Routes>
  );
}
