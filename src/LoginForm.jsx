import React, { useState } from "react";
import { Link } from "react-router-dom"; // Dùng để điều hướng

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");

    if (!email && !password) {
      setMessage("Vui lòng nhập email và mật khẩu.");
      setError(true);
      return;
    }

    if (!email) {
      setMessage("Vui lòng nhập email.");
      setError(true);
      return;
    }

    if (!password) {
      setMessage("Vui lòng nhập mật khẩu.");
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMessage("Đăng nhập thành công");
        setError(false);
      } else {
        const err = await response.text();
        setMessage(`Lỗi: ${err || "Email hoặc mật khẩu không đúng"}`);
        setError(true);
      }
    } catch (error) {
      setMessage("Lỗi kết nối server: " + error.message);
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập tài khoản</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <input
          className="login-input"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>

      <div className="login-divider">
        <hr className="line" />
        <span className="login-divider-text">Tiếp tục với</span>
        <hr className="line" />
      </div>

      <div className="social-icons">
        <img
          className="social-icon"
          src="https://cdn-icons-png.flaticon.com/512/145/145802.png"
          alt="Facebook"
        />
        <img
          className="social-icon"
          src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
          alt="Google"
        />
      </div>

      <div className="login-footer-links">
        <a href="#">Quên mật khẩu?</a>
        <span> | </span>
        <Link to="/register">Tạo tài khoản mới</Link>
      </div>

      {message && (
        <p className={`login-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginForm;
