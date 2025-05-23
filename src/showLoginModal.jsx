import React, { useState } from "react";
import LoginForm from "./LoginForm";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="header">
        {/* Phần logo và menu */}
        <div className="nav-left">
          {/* Logo ảnh + chữ */}
          <div className="logo-container">
            <img
              src="/path-to-logo.jpg"
              alt="Phòng Chống Ma Túy"
              className="logo-image"
            />
            <span className="logo-text">
              Phòng Chống<br />
              Ma Túy
            </span>
          </div>

          {/* Các menu */}
          <span className="nav-item">Sản phẩm</span>
          <span className="nav-item">Giải pháp</span>
          <span className="nav-item">Cộng đồng</span>
          <span className="nav-item">Tài nguyên</span>
          <span className="nav-item">Bảng giá</span>
          <span className="nav-item">Liên hệ</span>
        </div>

        {/* Nút Đăng nhập và Đăng ký */}
        <div className="nav-right">
          <button className="btn sign-in" onClick={() => setShowLoginModal(true)}>
            Đăng nhập
          </button>
          <button className="btn register">Đăng ký</button>
        </div>
      </header>

      {/* Modal đăng nhập */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setShowLoginModal(false)}
              aria-label="Close login form"
            >
              ×
            </button>
            <LoginForm onLoginSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
