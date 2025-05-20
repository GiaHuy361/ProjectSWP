import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const VerifyCodeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60); // 60 giây đếm ngược

  useEffect(() => {
    if (timer <= 0) return;
    const intervalId = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleResendCode = () => {
    // Gọi API gửi lại mã xác minh tại đây
    setTimer(60);
    setMessage("Mã xác minh đã được gửi lại!");
    setError(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");

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
        navigate("/new-password", { state: { email, verificationCode: code } });
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
        Chúng tôi đã gửi sms mã kích hoạt tới điện thoại của bạn
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
        disabled={timer > 0}
        style={{
          marginTop: "15px",
          border: "none",
          backgroundColor: "transparent",
          color: timer > 0 ? "#aaa" : "#333",
          cursor: timer > 0 ? "not-allowed" : "pointer",
          fontWeight: "600",
        }}
      >
        Gửi lại mã
      </button>

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
