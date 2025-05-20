import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const LoginForm = () => {
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
      setMessage("Đăng nhập thành công bằng Google");
      setError(false);
      console.log("Login success:", data);
    } catch (error) {
      setMessage("Lỗi kết nối server: " + error.message);
      setError(true);
    }
  };
  const handleGoogleFailure = () => {
  setMessage("Đăng nhập Google thất bại");
  setError(true);
};



  // Xử lý đăng nhập Facebook thành công
  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      console.log("Facebook token:", response.accessToken);
      // TODO: Gửi token này lên backend để xác thực
    } else {
      setMessage("Đăng nhập Facebook thất bại");
      setError(true);
    }
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
        setMessage("Đăng nhập thành công");
        setError(false);
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
    <div className="login-container">
      <h2 className="login-title">Đăng nhập tài khoản</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <input
          className="login-input"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>

      <div className="login-divider">
        <hr className="line" />
        <span className="login-divider-text">Tiếp tục với</span>
        <hr className="line" />
      </div>

      <div
        className="social-icons"
        style={{ display: "flex", justifyContent: "center", gap: "20px" }}
      >
        <FacebookLogin
          appId="YOUR_FACEBOOK_APP_ID" // Thay bằng App ID của bạn
          autoLoad={false}
          callback={handleFacebookResponse}
          render={(renderProps) => (
            <img
              className="social-icon"
              src="https://cdn-icons-png.flaticon.com/512/145/145802.png"
              alt="Facebook"
              onClick={renderProps.onClick}
              style={{ cursor: "pointer", width: "40px", height: "40px" }}
            />
          )}
        />

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          useOneTap
          width={40}
          shape="circle"
        />
      </div>

      <div className="login-footer-links">
        <a href="/forgot-password">Quên mật khẩu?</a>
        <span> | </span>
        <Link to="/register">Tạo tài khoản mới</Link>
      </div>

      {message && (
        <p className={`login-message ${error ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginForm;
