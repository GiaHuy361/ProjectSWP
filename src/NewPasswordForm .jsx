import React, { useState, useEffect } from "react";

const NewPasswordForm = ({ switchForm, email, verificationCode }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !verificationCode) {
      setIsError(true);
      setMessage("Thiếu thông tin email hoặc mã xác minh. Vui lòng thực hiện lại từ đầu.");
      setTimeout(() => {
        if (switchForm) switchForm("forgotPassword");
      }, 3000);
    }
  }, [email, verificationCode, switchForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setMessage("");

    if (!password.trim() || !confirmPassword.trim()) {
      setIsError(true);
      setMessage("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationCode,
          newPassword: password,
        }),
      });

      const text = await response.text();

      if (response.ok) {
        setIsError(false);
        setMessage("Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.");
        setTimeout(() => {
          if (switchForm) switchForm("login");
        }, 2000);
      } else {
        setIsError(true);
        setMessage(text || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("Lỗi kết nối server: " + err.message);
    } finally {
      setLoading(false);
    }
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
      <h3 style={{ fontWeight: "bold", marginBottom: "25px" }}>Hoàn tất</h3>
      <p style={{ marginBottom: "30px", fontSize: "14px", color: "#555" }}>
        Vui lòng nhập mật khẩu mới của bạn
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "15px",
            border: "none",
            backgroundColor: "#ddd",
            color: "#333",
            marginBottom: "20px",
            fontWeight: "600",
          }}
          aria-label="Mật khẩu mới"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "15px",
            border: "none",
            backgroundColor: "#ddd",
            color: "#333",
            marginBottom: "30px",
            fontWeight: "600",
          }}
          aria-label="Nhập lại mật khẩu mới"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "15px",
            backgroundColor: loading ? "#888" : "#333",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
          }}
        >
          {loading ? "Đang xử lý..." : "Hoàn tất"}
        </button>
      </form>

      

      {message && (
        <p
          style={{
            marginTop: "25px",
            color: isError ? "red" : "green",
            fontWeight: "600",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewPasswordForm;
