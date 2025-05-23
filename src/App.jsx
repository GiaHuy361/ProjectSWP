import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./HomePage";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm "; // Bỏ dấu cách thừa
import ForgotPasswordForm from "./ForgotPasswordForm "; // Bỏ dấu cách thừa
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm "; // Bỏ dấu cách thừa
import Header from "./Header";

import ShowLoginModal from "./showLoginModal";

import "./App.css";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId="964232858341-5tr0k7mju0l31mg9amdlvf74eacau5tr.apps.googleusercontent.com">
      <BrowserRouter>
        <Header onLoginClick={openLoginModal} />
        {isLoginModalOpen && <ShowLoginModal onClose={closeLoginModal} />}
        <Routes>
          {/* Route mặc định "/" sẽ dẫn tới HomePage */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <HomePage />
              ) : (
                // Nếu chưa đăng nhập thì chuyển hướng sang /login
                <Navigate to="/home" replace />
              )
            }
          />

          {/* Route login */}
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Các route khác */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/verify-code" element={<VerifyCodeForm />} />
          <Route path="/new-password" element={<NewPasswordForm />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
