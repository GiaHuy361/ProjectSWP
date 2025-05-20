import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm "; // File bạn đã tạo
import ForgotPasswordForm from "./ForgotPasswordForm ";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm ";
import Header from "./Header";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} /> {/* Đường dẫn mới */}
         <Route path="/verify-code" element={<VerifyCodeForm />} />
         <Route path="/new-password" element={<NewPasswordForm />} />
      </Routes>
      <footer>© 2025 Hệ thống Hỗ trợ Phòng chống Sử dụng Ma túy</footer>
    </BrowserRouter>
  );
}

export default App;
