
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

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "100px auto",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "40px 30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      textAlign: "center",
      userSelect: "none",
    },
    title: {
      fontWeight: "700",
      fontSize: "28px",
      marginBottom: "25px",
      color: "#2a9d8f",
      letterSpacing: "0.4px",
    },
    subtitle: {
      fontSize: "14px",
      marginBottom: "30px",
      color: "#555",
      userSelect: "text",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1.5px solid #ccc",
      boxSizing: "border-box",
      outlineOffset: "2px",
      fontWeight: "600",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      color: "#222",
      backgroundColor: "#fafafa",
      marginBottom: "20px",
    },
    inputFocus: {
      borderColor: "#2a9d8f",
      boxShadow: "0 0 8px rgba(42, 157, 143, 0.4)",
      backgroundColor: "#fff",
    },
    button: {
      width: "100%",
      padding: "16px 0",
      borderRadius: "8px",
      backgroundColor: "#2a9d8f",
      color: "#fff",
      fontWeight: "700",
      fontSize: "18px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(42, 157, 143, 0.6)",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      userSelect: "none",
      marginBottom: "20px",
    },
    buttonDisabled: {
      backgroundColor: "#888",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    message: {
      marginTop: "25px",
      fontWeight: "700",
      fontSize: "16px",
      userSelect: "none",
    },
    error: {
      color: "#d93025",
    },
    success: {
      color: "#188038",
    },
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = styles.inputFocus.borderColor;
    e.currentTarget.style.boxShadow = styles.inputFocus.boxShadow;
    e.currentTarget.style.backgroundColor = styles.inputFocus.backgroundColor;
  };
  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = styles.input.border;
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.backgroundColor = styles.input.backgroundColor;
  };

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
        body: JSON.stringify({ email, verificationCode, newPassword: password }),
      });

      const text = await response.text();

      if (response.ok) {
        // Lấy permissions từ API /api/auth/user sau khi đổi mật khẩu
        const userResponse = await fetch('http://localhost:8080/api/auth/user', {
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
        } else {
          localStorage.removeItem('permissions');
        }

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
    <div style={styles.container}>
      <h3 style={styles.title}>Hoàn tất</h3>
      <p style={styles.subtitle}>Vui lòng nhập mật khẩu mới của bạn</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Mật khẩu mới"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Nhập lại mật khẩu mới"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Đang xử lý..." : "Hoàn tất"}
        </button>
      </form>

      {message && (
        <p
          style={{
            ...styles.message,
            ...(isError ? styles.error : styles.success),
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewPasswordForm;
