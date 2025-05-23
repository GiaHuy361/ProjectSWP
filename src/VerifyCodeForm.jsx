import React, { useState, useEffect } from "react";

const VerifyCodeForm = ({ switchForm, email }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60); // Thời gian đếm ngược (giây)

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);


  const handleResendCode = async () => {
    if (!email) {
      setMessage("Email không tồn tại, không thể gửi lại mã.");
      setError(true);
      return;
    }
    setTimer(60); // reset timer khi gửi lại mã
    setMessage("");
    setError(false);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await response.text();

      if (response.ok) {
        setMessage("Mã xác minh đã được gửi lại!");
        setError(false);
      } else {
        setMessage(text || "Gửi lại mã xác minh thất bại.");
        setError(true);
      }
    } catch (err) {
      setMessage("Lỗi kết nối server: " + err.message);
      setError(true);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");

    if (!email) {
      setMessage("Email không tồn tại, vui lòng nhập lại email.");
      setError(true);
      return;
    }

    if (!code) {
      setMessage("Vui lòng nhập mã xác minh.");
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: code }),
      });

      if (response.ok) {
        setMessage("");
        switchForm("newPassword", { email, verificationCode: code });
      } else {
        const text = await response.text();
        setMessage(text || "Mã xác minh không hợp lệ hoặc đã hết hạn.");
        setError(true);
      }
    } catch (err) {
      setMessage("Lỗi kết nối server: " + err.message);
      setError(true);
    }
    setLoading(false);
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        maxWidth: "320px",
        margin: "100px auto",
        backgroundColor: "#f0f0f0",
        borderRadius: "20px",
        padding: "40px 30px",
        fontFamily: "'Roboto Slab', serif",
        color: "#333",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontWeight: "bold", marginBottom: "25px" }}>Nhập mã</h3>
      <p style={{ fontSize: "14px", marginBottom: "30px" }}>
        Chúng tôi đã gửi mã kích hoạt tới email của bạn
      </p>

      <form onSubmit={handleCodeSubmit}>
        <input
          type="text"
          maxLength={6}
          placeholder="Mã xác minh"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "15px",
            border: "none",
            backgroundColor: "#ddd",
            color: "#333",
            marginBottom: "25px",
            fontWeight: "600",
            letterSpacing: "8px",
            fontSize: "22px",
            textAlign: "center",
            userSelect: "none",
          }}
          aria-label="Mã xác minh"
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "15px",
            backgroundColor: "#333",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
          }}
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </form>

      <div style={{ fontSize: "13px", color: "#555" }}>
        Gửi lại mã sau: {formatTimer()}
      </div>

      <button
        onClick={handleResendCode}
        disabled={timer > 0 || loading}
        style={{
          marginTop: "15px",
          border: "none",
          backgroundColor: "transparent",
          color: timer > 0 || loading ? "#aaa" : "#333",
          cursor: timer > 0 || loading ? "not-allowed" : "pointer",
          fontWeight: "600",
        }}
      >
        Gửi lại mã
      </button>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          type="button"
          onClick={() => switchForm("forgotPassword")}
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
          ← Quay trở lại nhập email
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: "25px",
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

export default VerifyCodeForm;
