import React from "react";
import Logo from "./assets/logo.jpg";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-bar">
        <div className="nav-left">
          {/* Logo ảnh + chữ */}
          <div className="logo-container">
            <img
              src={Logo}
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
        <div className="nav-right">
          <button className="btn sign-in">Đăng nhập</button>
          <button className="btn register">Đăng ký</button>
        </div>
      </nav>
      <div className="header-title">
        Kiến thức đúng – Hành động chuẩn – Chủ động phòng HIV
      </div>
    </header>
  );
};

export default Header;
