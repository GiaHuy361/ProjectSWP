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
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Styles nâng cấp, đồng bộ với form login/register
  const styles = {
    container: {
      maxWidth: "420px",
      margin: "40px auto",
      padding: "40px 30px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "none",
      textAlign: "center",
      color: "#333",
    },
    title: {
      fontWeight: "700",
      fontSize: "28px",
      marginBottom: "25px",
      color: "#2a9d8f",
    },
    infoText: {
      fontSize: "15px",
      marginBottom: "30px",
      fontWeight: "500",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    input: {
      width: "100%",
      padding: "14px",
      fontWeight: "600",
      fontSize: "22px",
      letterSpacing: "8px",
      borderRadius: "8px",
      border: "1.5px solid #ccc",
      textAlign: "center",
      boxSizing: "border-box",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      outlineOffset: "2px",
      userSelect: "none",
      color: "#333",
      backgroundColor: "#f9f9f9",
    },
    inputFocus: {
      borderColor: "#2a9d8f",
      boxShadow: "0 0 8px rgba(42, 157, 143, 0.4)",
      backgroundColor: "#fff",
    },
    button: {
      width: "100%",
      padding: "14px",
      borderRadius: "8px",
      backgroundColor: "#2a9d8f",
      color: "#fff",
      fontWeight: "700",
      fontSize: "18px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginBottom: "20px",
    },
    buttonHover: {
      backgroundColor: "#21867a",
    },
    timerText: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "10px",
      fontWeight: "600",
    },
    resendButton: {
      border: "none",
      backgroundColor: "transparent",
      color: "#2a9d8f",
      fontWeight: "600",
      cursor: "pointer",
      userSelect: "none",
      padding: "0",
      marginTop: "5px",
      transition: "color 0.3s ease",
    },
    resendButtonDisabled: {
      color: "#aaa",
      cursor: "not-allowed",
    },
    backButtonContainer: {
      marginTop: "25px",
    },
    backButton: {
      background: "none",
      border: "none",
      color: "blue",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "underline",
      padding: "0",
      userSelect: "none",
    },
    message: {
      marginTop: "25px",
      fontWeight: "600",
      fontSize: "15px",
    },
    error: {
      color: "#d93025",
    },
    success: {
      color: "#188038",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Nhập mã</h3>
      <p style={styles.infoText}>
        Chúng tôi đã gửi mã kích hoạt tới email của bạn
      </p>

      <form onSubmit={handleCodeSubmit} style={styles.form}>
        <input
          type="text"
          maxLength={6}
          placeholder="Mã xác minh"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
          aria-label="Mã xác minh"
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = styles.inputFocus.borderColor;
            e.currentTarget.style.boxShadow = styles.inputFocus.boxShadow;
            e.currentTarget.style.backgroundColor = styles.inputFocus.backgroundColor;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = styles.input.border;
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor = styles.input.backgroundColor;
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading && { cursor: "not-allowed", opacity: 0.7 }),
          }}
          onMouseEnter={(e) =>
            !loading && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            !loading && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </form>

      <div style={styles.timerText}>Gửi lại mã sau: {formatTimer()}</div>

      <button
        onClick={handleResendCode}
        disabled={timer > 0 || loading}
        style={{
          ...styles.resendButton,
          ...(timer > 0 || loading ? styles.resendButtonDisabled : {}),
        }}
      >
        Gửi lại mã
      </button>

      <div style={styles.backButtonContainer}>
        <button
          type="button"
          onClick={() => switchForm("forgotPassword")}
          style={styles.backButton}
        >
          ← Quay trở lại nhập email
        </button>
      </div>

      {message && (
        <p
          style={{
            ...styles.message,
            ...(error ? styles.error : styles.success),
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyCodeForm;
