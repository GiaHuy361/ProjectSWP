import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordForm = ({ switchForm }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");

    if (!email) {
      setMessage("Vui lòng nhập email.");
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();

      // ...code cũ...
      if (response.ok) {
        // Lưu email lên state cha qua switchForm
        setTimeout(() => {
          switchForm("verify-code", { email });
        }, 1500);
      } else {
        setMessage(text || "Gửi mã xác minh thất bại");
        setError(true);
      }


    } catch (err) {
      setMessage("Lỗi kết nối server: " + err.message);
      setError(true);
    }
  };

  return (
    <div
      style={{
        maxWidth: "320px",
        margin: "100px auto",
        backgroundColor: "#f0f0f0",
        borderRadius: "20px",
        padding: "30px 20px",
        fontFamily: "'Roboto Slab', serif",
        color: "#333",
        textAlign: "center",
      }}
    >
      <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>Khôi phục mật khẩu</h3>
      <p style={{ marginBottom: "25px" }}>
        Vui lòng nhập địa chỉ email của
        <br /> bạn để nhận mã xác minh
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="exmaple@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontStyle: "italic",
            fontWeight: "600",
            borderRadius: "15px",
            border: "none",
            backgroundColor: "#ddd",
            color: "#aaa",
            marginBottom: "30px",
            boxSizing: "border-box",
          }}
          aria-label="Email"
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "15px",
            backgroundColor: "#333",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          Tiếp tục
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          type="button"
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
        <p
          style={{
            marginTop: "20px",
            color: error ? "red" : "green",
            fontWeight: "600",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
