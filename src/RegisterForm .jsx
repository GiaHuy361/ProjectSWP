import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = ({ onRegisterSuccess, switchForm }) => {
  // Thêm username và fullName
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(false);
    setMessage("");

    // Kiểm tra bắt buộc nhập các trường
    if (!username || !fullName || !email || !password || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ thông tin.");
      setError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu và nhập lại mật khẩu không khớp.");
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName,
          email,
          password,
          phone,
        }),
      });

      if (response.ok) {
        setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setError(false);
        // Reset form
        setUsername("");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhone("");

        // Gọi callback onRegisterSuccess nếu có
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        const err = await response.text();
        setMessage(`Lỗi: ${err || "Đăng ký thất bại"}`);
        setError(true);
      }
    } catch (error) {
      setMessage("Lỗi kết nối server: " + error.message);
      setError(true);
    }
  };

  const resetError = () => {
    if (error) {
      setError(false);
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {/* Các input */}
        <input
          className="register-input"
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            resetError();
          }}
          required
          aria-label="Tên đăng nhập"
        />
        <input
          className="register-input"
          type="text"
          placeholder="Họ và tên đầy đủ"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            resetError();
          }}
          required
          aria-label="Họ và tên đầy đủ"
        />
        <input
          className="register-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            resetError();
          }}
          required
          aria-label="Email"
        />
        <input
          className="register-input"
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            resetError();
          }}
          aria-label="Số điện thoại"
        />
        <input
          className="register-input"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            resetError();
          }}
          required
          aria-label="Mật khẩu"
        />
        <input
          className="register-input"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            resetError();
          }}
          required
          aria-label="Nhập lại mật khẩu"
        />

        <button type="submit" className="register-button">Đăng ký</button>
      </form>

       <div className="login-footer-links" style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => switchForm && switchForm("login")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          ← Quay trở lại đăng nhập
        </button>
      </div>

      {message && (
        <p className={`register-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterForm;