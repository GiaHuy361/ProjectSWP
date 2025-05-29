import React, { useState } from "react";

const RegisterForm = ({ onRegisterSuccess, switchForm }) => {
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
        body: JSON.stringify({ username, fullName, email, password, phone }),
      });

      if (response.ok) {
        setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setError(false);
        setUsername("");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhone("");

        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
        }, 2500);
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

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "40px auto",
      padding: "30px 25px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "none",
      color: "#333",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "25px",
      color: "#2a9d8f",
      letterSpacing: "0.4px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "12px 14px",
      fontSize: "15px",
      border: "1.6px solid #ccc",
      borderRadius: "6px",
      boxSizing: "border-box",
      outlineOffset: "2px",
      color: "#222",
      backgroundColor: "#fafafa",
      fontWeight: "600",
      transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    inputFocus: {
      borderColor: "#2a9d8f",
      boxShadow: "0 0 10px rgba(42, 157, 143, 0.4)",
      backgroundColor: "#fff",
    },
    button: {
      padding: "14px 0",
      width: "100%",
      backgroundColor: "#2a9d8f",
      color: "#fff",
      fontWeight: "700",
      fontSize: "17px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 4px 12px rgba(42, 157, 143, 0.6)",
      userSelect: "none",
    },
    buttonHover: {
      backgroundColor: "#21867a",
      boxShadow: "0 6px 15px rgba(33, 134, 122, 0.7)",
    },
    footerLinks: {
      marginTop: "22px",
      fontSize: "14px",
      userSelect: "none",
      textAlign: "center",
    },
    footerButton: {
      background: "none",
      border: "none",
      color: "#2a9d8f",
      fontWeight: "700",
      cursor: "pointer",
      textDecoration: "underline",
      padding: 0,
      margin: "0 4px",
      transition: "color 0.3s ease",
      userSelect: "none",
    },
    footerButtonHover: {
      color: "#1b665a",
    },
    message: {
      marginTop: "18px",
      fontWeight: "700",
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

  // Xử lý focus/blur inputs để tạo hiệu ứng viền bóng mượt
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            resetError();
          }}
          required
          aria-label="Tên đăng nhập"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="text"
          placeholder="Họ và tên đầy đủ"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            resetError();
          }}
          required
          aria-label="Họ và tên đầy đủ"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            resetError();
          }}
          required
          aria-label="Email"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            resetError();
          }}
          aria-label="Số điện thoại"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            resetError();
          }}
          required
          aria-label="Mật khẩu"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            resetError();
          }}
          required
          aria-label="Nhập lại mật khẩu"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          Đăng ký
        </button>
      </form>
      <div style={styles.footerLinks}>
        <button
          onClick={() => switchForm && switchForm("login")}
          style={styles.footerButton}
          onMouseEnter={(e) => (e.currentTarget.style.color = styles.footerButtonHover.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = styles.footerButton.color)}
        >
          ← Quay trở lại đăng nhập
        </button>
      </div>
      {message && (
        <p style={{ ...styles.message, ...(error ? styles.error : styles.success) }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RegisterForm;
