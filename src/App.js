import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import DashboardPreview from './components/Dashboard/DashboardPreview';
import { getAuthData, clearAuthData } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore authenticated session from storage on app load
  useEffect(() => {
    const storedAuth = getAuthData();
    if (storedAuth && storedAuth.user) {
      const userData = storedAuth.user;
      const tokens = {
        access: storedAuth.accessToken,
        refresh: storedAuth.refreshToken
      };

      const restoredUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.username || 'User',
        role: userData.role_name || (userData.role === 5 ? 'Employee' : 'User'),
        role_name: userData.role_name,
        role_id: userData.role,
        employeeId: `EMP-${userData.id || '1'}`,
        phone: userData.phone,
        profile_image: userData.profile_image,
        is_active: userData.is_active,
        created_at: userData.created_at,
        tokens: tokens,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCurrentUser(restoredUser);
    }
    setIsLoadingSession(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearAuthData();
    setCurrentUser(null);
  };

  if (isLoadingSession) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#090d16',
        color: '#94a3b8',
        fontFamily: 'sans-serif'
      }}>
        <div>Loading session...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {!currentUser ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DashboardPreview user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
