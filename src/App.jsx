import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm "; // Đã bỏ dấu cách thừa
import ForgotPasswordForm from "./ForgotPasswordForm "; // Bỏ dấu cách thừa
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm "; // Bỏ dấu cách thừa
import Header from "./Header";
import "./App.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="964232858341-5tr0k7mju0l31mg9amdlvf74eacau5tr.apps.googleusercontent.com">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/verify-code" element={<VerifyCodeForm />} />
          <Route path="/new-password" element={<NewPasswordForm />} />
        </Routes>
        <footer>© 2025 Hệ thống Hỗ trợ Phòng chống Sử dụng Ma túy</footer>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
