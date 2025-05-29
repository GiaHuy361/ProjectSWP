import React, { useState } from "react";

import { GoogleLogin } from "@react-oauth/google";

import { Link, useNavigate } from "react-router-dom";


const LoginForm = ({ onLoginSuccess, switchForm }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);


  // Xử lý đăng nhập Google thành công

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage("Google login failed: " + errorText);
        setError(true);
        return;
      }

      const data = await response.json();


      if (data.roles) {
        const roleNames = data.roles.map(role => role.roleName || role);
        localStorage.setItem("roles", JSON.stringify(roleNames));
      } else {
        localStorage.removeItem("roles");
      }
      if (data.fullName) {
        localStorage.setItem("userName", data.fullName);
      }
      if (data.email) {
        localStorage.setItem("email", data.email);
      }

      // --- gọi API profile để lấy thêm userProfile ---
      const profileResponse = await fetch(`http://localhost:8080/api/auth/profile?email=${encodeURIComponent(data.email)}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.profile) {
          localStorage.setItem("userType", profileData.profile.userType || "");
          localStorage.setItem("dateOfBirth", profileData.profile.dateOfBirth || "");
          // Bạn có thể lưu thêm các trường khác nếu muốn
        }
      }
      setMessage("Đăng nhập thành công bằng Google");
      setError(false);

      // Đảm bảo localStorage đã xong rồi mới gọi onLoginSuccess
      // Nếu onLoginSuccess gọi trước localStorage.setItem có thể gây lỗi
      if (onLoginSuccess) {
        // Đợi 1 tick event loop để chắc chắn localStorage đã ghi xong
        setTimeout(() => {
          onLoginSuccess();
          navigate("/home");
        }, 0);
      } else {
        navigate("/home");
      }
    } catch (error) {
      setMessage("Lỗi kết nối server: " + error.message);
      setError(true);
    }
  };

  const handleGoogleFailure = () => {
    setMessage("Đăng nhập Google thất bại");
    setError(true);
  };





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
        const data = await response.json();

        // Lưu roles nhận được
        if (data.roles) {
          localStorage.setItem("roles", JSON.stringify(data.roles));
        } else {
          localStorage.removeItem("roles");
        }
        if (data.fullName) {
          localStorage.setItem("userName", data.fullName);
        }
        if (data.email) {
          localStorage.setItem("email", data.email);
        }

        // --- gọi API lấy profile ---
        // Gọi API lấy profile
        const profileResponse = await fetch(`http://localhost:8080/api/auth/profile?email=${encodeURIComponent(data.email)}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("profileData", profileData); // bạn có thể log để xác nhận cấu trúc

          // Vì API trả về DTO phẳng nên dùng trực tiếp
          localStorage.setItem("userType", profileData.userType || "");
          localStorage.setItem("dateOfBirth", profileData.dateOfBirth || "");
          localStorage.setItem("phone", profileData.phone || "");
          // bạn có thể lưu thêm nếu muốn như schoolName, address...
        }



        setMessage("Đăng nhập thành công");
        setError(false);
        if (onLoginSuccess) onLoginSuccess();
        navigate("/home");
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
    <div
      style={{
        maxWidth: 420,
        margin: "30px auto",
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 30,
          color: "#2a9d8f",
        }}
      >
        Đăng nhập tài khoản
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <input
          className="inputEmail"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          style={{
            padding: 14,
            fontSize: 16,
            border: "1.5px solid #ccc",
            borderRadius: 8,
            outlineOffset: 2,
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#2a9d8f";
            e.target.style.boxShadow = "0 0 8px rgba(42,157,143,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ccc";
            e.target.style.boxShadow = "none";
          }}
        />

        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          style={{
            padding: 14,
            fontSize: 16,
            border: "1.5px solid #ccc",
            borderRadius: 8,
            outlineOffset: 2,
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#2a9d8f";
            e.target.style.boxShadow = "0 0 8px rgba(42,157,143,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ccc";
            e.target.style.boxShadow = "none";
          }}
        />

        <button
          type="submit"
          style={{
            padding: 14,
            backgroundColor: "#2a9d8f",
            color: "#fff",
            fontWeight: "700",
            fontSize: 18,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#21867a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2a9d8f")}
        >
          Đăng nhập
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 28,
          marginBottom: 20,
        }}
      >
        <hr style={{ flexGrow: 1, border: "none", borderTop: "1px solid #ccc" }} />
        <span
          style={{
            fontSize: 14,
            color: "#888",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Tiếp tục với
        </span>
        <hr style={{ flexGrow: 1, border: "none", borderTop: "1px solid #ccc" }} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginBottom: 20,
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          useOneTap
          width={40}
          shape="circle"
        />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 14,
          userSelect: "none",
        }}
      >
        <span
          onClick={() => switchForm && switchForm("forgotPassword")}
          style={{
            cursor: "pointer",
            color: "#2a9d8f",
            textDecoration: "underline",
            margin: "0 6px",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#145a4e")}
          onMouseLeave={(e) => (e.target.style.color = "#2a9d8f")}
        >
          Quên mật khẩu?
        </span>
        <span> | </span>
        <span
          onClick={() => switchForm && switchForm("register")}
          style={{
            cursor: "pointer",
            color: "#2a9d8f",
            textDecoration: "underline",
            margin: "0 6px",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#145a4e")}
          onMouseLeave={(e) => (e.target.style.color = "#2a9d8f")}
        >
          Tạo tài khoản mới
        </span>
      </div>

      {message && (
        <p
          style={{
            marginTop: 16,
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15,
            userSelect: "none",
            color: error ? "#d93025" : "#188038",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {message}
        </p>
      )}

      {/* Animation keyframes */}
      <style>
        {`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
      `}
      </style>
    </div>
  );



};

export default LoginForm;
