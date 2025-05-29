import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./HomePage";
import CourseRegistrationPage from "./CourseRegistrationPage";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import ForgotPasswordForm from "./ForgotPasswordForm ";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm ";
import Header from "./Header";
import ShowLoginModal from "./showLoginModal";

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
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/course-registration" element={<CourseRegistrationPage />} />
            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/verify-code" element={<VerifyCodeForm />} />
            <Route path="/new-password" element={<NewPasswordForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
