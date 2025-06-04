import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import HomePage from './HomePage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

import VerifyCodeForm from './VerifyCodeForm';
import NewPasswordForm from './NewPasswordForm';
import Header from './Header';
import ShowLoginModal from './showLoginModal';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // Đồng bộ isLoggedIn và permissions từ API /api/auth/user
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setPermissions(data.permissions || []);
          localStorage.setItem('permissions', JSON.stringify(data.permissions || []));
        } else {
          setIsLoggedIn(false);
          setPermissions([]);
          localStorage.removeItem('permissions');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        setPermissions([]);
        localStorage.removeItem('permissions');
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <GoogleOAuthProvider clientId='964232858341-5tr0k7mju0l31mg9amdlvf74eacau5tr.apps.googleusercontent.com'>
      <BrowserRouter>
        <Header onLoginClick={openLoginModal} />
        {isLoginModalOpen && <ShowLoginModal onClose={closeLoginModal} />}
        <div className='mainContent'>
          <Routes>
            <Route path='/' element={<Navigate to='/home' replace />} />
            <Route path='/home' element={<HomePage />} />
            
            <Route
              path='/login'
              element={
                !isLoggedIn ? (
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to='/home' replace />
                )
              }
            />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/forgot-password' element={<ForgotPasswordForm />} />
            <Route path='/verify-code' element={<VerifyCodeForm />} />
            <Route path='/new-password' element={<NewPasswordForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;