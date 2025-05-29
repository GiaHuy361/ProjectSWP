import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/logo.jpg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm ";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm ";
import UserProfile from "./UserProfile";
import styles from "./Header.module.css";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState("login");
  const [formParams, setFormParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [roles, setRoles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const navigate = useNavigate();

  // Load roles, username và profile từ localStorage khi component mount hoặc isLoggedIn thay đổi
  useEffect(() => {
    if (isLoggedIn) {
      const storedRoles = localStorage.getItem("roles");
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName || "");

      // Lấy profile (userType, dateOfBirth...) nếu có trong localStorage
      const storedProfile = {
        userType: localStorage.getItem("userType") || "",
        dateOfBirth: localStorage.getItem("dateOfBirth") || "",
      };
      setProfileData(storedProfile);
    } else {
      setRoles([]);
      setUserName("");
      setProfileData(null);
    }
  }, [isLoggedIn]);

  const openModal = (type) => {
    setFormType(type);
    setFormParams({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormParams({});
  };

  const switchForm = (type, params = {}) => {
    setFormType(type);
    setFormParams(params);
  };

  // Sửa hàm này để gọi API lấy user profile khi đăng nhập thành công
  const handleLoginSuccess = async () => {
    try {
      const storedRoles = localStorage.getItem("roles");
      const storedUserName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("email");

      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      setUserName(storedUserName || "");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");

      // Gọi API lấy profile user đầy đủ theo email
      if (storedEmail) {
        const response = await fetch(`http://localhost:8080/api/auth/profile?email=${encodeURIComponent(storedEmail)}`);
        if (response.ok) {
          const profileResult = await response.json();
          if (profileResult) {
            localStorage.setItem("userType", profileResult.userType || "");
            localStorage.setItem("dateOfBirth", profileResult.dateOfBirth || "");
            setProfileData(profileResult);
          } else {
            localStorage.removeItem("userType");
            localStorage.removeItem("dateOfBirth");
            setProfileData(null);
          }

        }
      }
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lấy profile user:", error);
      setProfileData(null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("roles");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    localStorage.removeItem("dateOfBirth");
    localStorage.removeItem("email");
    setRoles([]);
    setUserName("");
    setProfileData(null);
    setDropdownOpen(false);
  };

  const openProfileModal = async () => {
    setDropdownOpen(false);
    setProfileLoading(true);
    setProfileError(null);
    setProfileModalOpen(true);
    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("Không tìm thấy email người dùng");

      const response = await fetch(
        `http://localhost:8080/api/auth/profile?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Lấy thông tin hồ sơ thất bại");

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      setProfileError(error.message);
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const allMenus = {
    Guest: ["Trang chủ", "Khóa học", "Chương trình", "FAQ"],
    Student: ["Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình", "FAQ"],
    Parent: [
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Báo cáo", "FAQ"
    ],
    Member: ["Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình", "FAQ"],
    Staff: [
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Quản lý chuyên viên", "Báo cáo", "FAQ"
    ],
    Consultant: [
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Quản lý chuyên viên", "Báo cáo", "FAQ"
    ],
    Teacher: [ // giống Parent
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Báo cáo", "FAQ"
    ],
    Manager: [
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Quản lý chuyên viên", "Quản lý người dùng", "Báo cáo", "FAQ"
    ],
    Admin: [
      "Trang chủ", "Khóa học", "Khảo sát", "Đặt lịch", "Chương trình",
      "Người tham gia", "Quản lý chuyên viên", "Quản lý người dùng", "Báo cáo", "FAQ"
    ],
  };

  const getMenusForRoles = (roles) => {
    if (!roles || roles.length === 0) return allMenus.Guest;
    const priority = ["Admin", "Manager", "Teacher", "Consultant", "Staff", "Parent", "Student","Member"];
    for (const p of priority) {
      if (roles.includes(p)) {
        return allMenus[p];
      }
    }
    return allMenus.Guest;
  };

  const menuItems = getMenusForRoles(roles);

  return (
    <header className={styles.header}>
      <nav className={styles.navBar}>
        <div className={styles.navLeft}>
          <div
            className={styles.logoContainer}
            onClick={() => window.location.reload()}
          >
            <img src={Logo} alt="Phòng Chống Ma Túy" className={styles.logoImage} />
            <span className={styles.logoText}>
              Phòng Ngừa<br />Ma Túy
            </span>
          </div>

          <div className={styles.navMenu}>
            {menuItems.map((item) => (
              <div
                key={item}
                className={styles.navItem}
                style={{ cursor: item === "Trang chủ" ? "pointer" : "default" }}
                onClick={() => {
                  if (item === "Trang chủ") {
                    navigate("/home");
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>

        </div>

        <div className={styles.navRight}>
          {!isLoggedIn ? (
            <button className={styles.btn} onClick={() => openModal("login")}>
              Đăng nhập
            </button>
          ) : (
            <div className={styles.userMenu} onClick={() => setDropdownOpen(prev => !prev)}>
              <div className={styles.avatar}>{userName ? userName.charAt(0) : ""}</div>
              <span>{userName}</span>
              <span className={styles.dropdownArrow}>▼</span>

              {dropdownOpen && (
                <div className={styles.userDropdown} onClick={e => e.stopPropagation()}>
                  <div className={styles.userDropdownItem} onClick={openProfileModal}>Hồ sơ cá nhân</div>
                  <div className={styles.userDropdownItem}>Cài đặt</div>
                  <div className={styles.userDropdownItem}>Thông báo</div>
                  <div className={`${styles.userDropdownItem} ${styles.logout}`} onClick={handleLogout}>Đăng xuất</div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Đóng modal">&times;</button>

            {formType === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} switchForm={switchForm} />}
            {formType === "register" && <RegisterForm onRegisterSuccess={closeModal} switchForm={switchForm} />}
            {formType === "forgotPassword" && <ForgotPasswordForm switchForm={switchForm} />}
            {formType === "verify-code" && <VerifyCodeForm switchForm={switchForm} email={formParams.email} />}
            {formType === "newPassword" && (
              <NewPasswordForm
                switchForm={switchForm}
                email={formParams.email}
                verificationCode={formParams.verificationCode}
              />
            )}
          </div>
        </div>
      )}

      {profileModalOpen && (
        <div className={`${styles.modalOverlay} ${styles.profileOverlay}`} onClick={() => {
          setProfileModalOpen(false);
          setProfileData(null);
          setProfileError(null);
        }}>
          <div className={styles.profileModalContent} onClick={e => e.stopPropagation()}>
            <UserProfile
              user={profileData}
              loading={profileLoading}
              error={profileError}
              onClose={() => {
                setProfileModalOpen(false);
                setProfileData(null);
                setProfileError(null);
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
