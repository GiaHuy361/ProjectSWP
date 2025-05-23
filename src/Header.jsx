import React, { useState } from "react";
import Logo from "./assets/logo.jpg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm ";
import ForgotPasswordForm from "./ForgotPasswordForm ";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm ";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState("login");
  const [formParams, setFormParams] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const openModal = (type) => {
    setFormType(type);
    setFormParams({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormParams({});
  };

  const switchForm = (type, params = {}) => {
    setFormType(type);
    setFormParams(params);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    closeModal();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <header className="header">
      <nav className="nav-bar">
        <div className="nav-left">
          <div
            className="logo-container"
            onClick={() => window.location.reload()}
            style={{ cursor: "pointer" }}  // Cho thấy là có thể click
          >
            <img src={Logo} alt="Phòng Chống Ma Túy" className="logo-image" />
            <span className="logo-text">
              Phòng Chống
              <br />
              Ma Túy
            </span>
          </div>

          <span className="nav-item">Sản phẩm</span>
          <span className="nav-item">Giải pháp</span>
          <span className="nav-item">Cộng đồng</span>
          <span className="nav-item">Tài nguyên</span>
          <span className="nav-item">Bảng giá</span>
          <span className="nav-item">Liên hệ</span>
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <button className="btn sign-in" onClick={() => openModal("login")}>
                Đăng nhập
              </button>
              <button className="btn register" onClick={() => openModal("register")}>
                Đăng ký
              </button>
            </>
          ) : (
            <button className="btn logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          )}
        </div>
      </nav>

      <div className="header-title">
        Kiến thức đúng – Hành động chuẩn – Chủ động phòng HIV
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "20px 30px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              position: "relative",
            }}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                border: "none",
                background: "none",
                fontSize: "28px",
                cursor: "pointer",
              }}
              aria-label="Đóng modal"
            >
              &times;
            </button>

            {formType === "login" && (
              <LoginForm onLoginSuccess={handleLoginSuccess} switchForm={switchForm} />
            )}
            {formType === "register" && (
              <RegisterForm onRegisterSuccess={closeModal} switchForm={switchForm} />
            )}
            {formType === "forgotPassword" && (
              <ForgotPasswordForm switchForm={switchForm} />
            )}
            {formType === "verify-code" && (
              <VerifyCodeForm switchForm={switchForm} email={formParams.email} />
            )}
            {formType === "newPassword" && (
              <NewPasswordForm
                switchForm={switchForm}
                email={formParams.email}
                verificationCode={formParams.verificationCode}
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
