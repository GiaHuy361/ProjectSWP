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

      if (response.ok) {
        setMessage("Mã xác minh đã được gửi đến email.");
        setError(false);

        // Chuyển form sau 1.5s
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

  // CSS inline style, đồng bộ với login form
  const styles = {
    container: {
      maxWidth: "420px",
      margin: "40px auto",
      padding: "30px 25px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "none",
      textAlign: "center",
      color: "#333",
    },
    title: {
      fontSize: "26px",
      fontWeight: "700",
      marginBottom: "25px",
      color: "#2a9d8f",
    },
    infoText: {
      marginBottom: "25px",
      fontSize: "15px",
      fontWeight: "500",
      lineHeight: "1.4",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    input: {
      padding: "14px",
      fontSize: "16px",
      border: "1.5px solid #ccc",
      borderRadius: "8px",
      outlineOffset: "2px",
      boxSizing: "border-box",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    button: {
      padding: "14px",
      width: "100%",
      backgroundColor: "#2a9d8f",
      color: "white",
      fontWeight: "700",
      fontSize: "18px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#21867a",
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
      padding: 0,
      userSelect: "none",
    },
    message: {
      marginTop: "20px",
      fontWeight: "600",
      fontSize: "15px",
      userSelect: "none",
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
      <h3 style={styles.title}>Khôi phục mật khẩu</h3>
      <p style={styles.infoText}>
        Vui lòng nhập địa chỉ email của bạn để nhận mã xác minh
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          style={styles.input}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = styles.button.backgroundColor)
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = styles.input.border)
          }
          required
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Tiếp tục
        </button>
      </form>

      <div style={styles.backButtonContainer}>
        <button
          type="button"
          onClick={() => switchForm && switchForm("login")}
          style={styles.backButton}
        >
          ← Quay trở lại đăng nhập
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

export default ForgotPasswordForm;