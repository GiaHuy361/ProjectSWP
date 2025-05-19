import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm "; // File bạn đã tạo
import Header from "./Header";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
      <footer>© 2025 Hệ thống Hỗ trợ Phòng chống Sử dụng Ma túy</footer>
    </BrowserRouter>
  );
}

export default App;
