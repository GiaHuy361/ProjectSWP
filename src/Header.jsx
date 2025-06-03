
import React, { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm "; 
import ForgotPasswordForm from "./ForgotPasswordForm ";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm ";
import Logo from "./assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 440,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState("login");
  const [formParams, setFormParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [permissions, setPermissions] = useState([]); // Thay roles bằng permissions
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = Boolean(anchorEl);

  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          setPermissions(data.permissions || []); // Lấy permissions từ server
          setUserName(data.fullName || '');
          setProfileData({
            userType: data.userType || localStorage.getItem("userType") || "",
            dateOfBirth: data.dateOfBirth || localStorage.getItem("dateOfBirth") || "",
          });
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          setPermissions([]);
          setUserName('');
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        setPermissions([]);
        setUserName('');
        setProfileData(null);
      }
    };

    checkLoginStatus();
  }, []);

  // Lắng nghe sự kiện loginSuccess để cập nhật trạng thái sau khi đăng nhập
  useEffect(() => {
    const handleLoginSuccessEvent = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          setPermissions(data.permissions || []); // Cập nhật permissions từ server
          setUserName(data.fullName || '');
          setProfileData({
            userType: data.userType || localStorage.getItem("userType") || "",
            dateOfBirth: data.dateOfBirth || localStorage.getItem("dateOfBirth") || "",
          });
        }
      } catch (error) {
        console.error('Error updating login status:', error);
      }
    };

    window.addEventListener('loginSuccess', handleLoginSuccessEvent);
    return () => window.removeEventListener('loginSuccess', handleLoginSuccessEvent);
  }, []);

  // Lắng nghe sự kiện logoutSuccess
  useEffect(() => {
    const handleLogoutSuccess = () => {
      setIsLoggedIn(false);
      localStorage.clear();
      setPermissions([]); // Reset permissions khi logout
      setUserName("");
      setProfileData(null);
      navigate('/home');
    };

    window.addEventListener('logoutSuccess', handleLogoutSuccess);
    return () => window.removeEventListener('logoutSuccess', handleLogoutSuccess);
  }, [navigate]);

  // Load user info and permissions from localStorage when login state changes
  useEffect(() => {
    if (isLoggedIn) {
      const storedPermissions = localStorage.getItem("permissions");
      setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName || "");
      setProfileData({
        userType: localStorage.getItem("userType") || "",
        dateOfBirth: localStorage.getItem("dateOfBirth") || "",
      });
    } else {
      setPermissions([]);
      setUserName("");
      setProfileData(null);
    }
  }, [isLoggedIn]);

  // Open modal of a specific form type and close drawer if mobile
  const openModal = (type) => {
    setFormType(type);
    setFormParams({});
    setModalOpen(true);
    setDrawerOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormParams({});
  };

  const switchForm = (type, params = {}) => {
    setFormType(type);
    setFormParams(params);
  };

  // After successful login, update states and fetch profile
  const handleLoginSuccess = async () => {
    try {
      const storedPermissions = localStorage.getItem("permissions");
      const storedUserName = localStorage.getItem("userName");
      const storedEmail = localStorage.getItem("email");

      setPermissions(storedPermissions ? JSON.parse(storedPermissions) : []);
      setUserName(storedUserName || "");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");

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

  // Sửa handleLogout
const handleLogout = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      setIsLoggedIn(false);
      localStorage.clear();
      setPermissions([]);
      setUserName("");
      setProfileData(null);
      handleCloseDropdown();
      setDrawerOpen(false);
      window.dispatchEvent(new Event('logoutSuccess'));
      navigate('/home');
      window.location.reload(); // Thêm dòng này để reload trang sau khi đăng xuất
    } else {
      console.error('Logout failed:', await response.text());
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  // Open profile modal and fetch fresh profile data
  const openProfileModal = async () => {
    handleCloseDropdown();
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

  // Define menu items by permissions
  const allMenus = {
    view_home: "Trang chủ",
    view_courses: "Khóa học",
    view_surveys: "Khảo sát",
    book_appointment: "Đặt lịch",
    view_programs: "Chương trình",
    view_participants: "Người tham gia",
    manage_consultants: "Quản lý chuyên viên",
    manage_users: "Quản lý người dùng",
    view_reports: "Báo cáo",
    view_faq: "FAQ",
  };
  const menuOrder = [
  "Trang chủ",
  "Khóa học",
  "Khảo sát",
  "Đặt lịch",
  "Chương trình",
  "Người tham gia",
  "Quản lý chuyên viên",
  "Quản lý người dùng",
  "Báo cáo",
  "FAQ",
];

  // Get menus based on permissions
  const getMenusForPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return ["Trang chủ", "Chương trình", "FAQ"];
    const menuItems = [];
    for (const perm of permissions) {
      if (allMenus[perm]) {
        menuItems.push(allMenus[perm]);
      }
    }
    const sortedMenuItems = menuItems.sort((a, b) => menuOrder.indexOf(a) - menuOrder.indexOf(b));
    return menuItems.length > 0 ? menuItems : ["Trang chủ", "Chương trình", "FAQ"];
  };

  const menuItems = getMenusForPermissions(permissions);

  // Handlers for user dropdown menu
  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  // Drawer toggle handler for mobile
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  // Drawer menu list
  const drawerMenu = (
    <Box
      sx={{ width: 250, bgcolor: "#fff" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item}
            onClick={() => {
              toggleDrawer(false)();
              if (item === "Trang chủ") navigate("/home");
            }}
          >
            <ListItemText
              primary={item}
              primaryTypographyProps={{
                fontWeight: 600,
                color: "#222",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#f9fafb",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
            }}
            onClick={() => navigate("/home")}
          >
            <Box
              component="img"
              src={Logo}
              alt="Phòng Chống Ma Túy"
              sx={{ height: 48, borderRadius: 1 }}
            />
            <Typography
              variant="h6"
              color="#2f855a"
              sx={{ userSelect: "none", lineHeight: 1.2 }}
            >
              Phòng Ngừa
              <br />
              Ma Túy
            </Typography>
          </Box>

          {/* Desktop menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3 }}>
              {menuItems.map((item) => (
                <Typography
                  key={item}
                  variant="button"
                  sx={{
                    cursor: item === "Trang chủ" ? "pointer" : "default",
                    userSelect: "none",
                    color: "#222",
                    fontWeight: 600,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#2f855a",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => item === "Trang chủ" && navigate("/home")}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: "#2f855a" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box>
            {!isLoggedIn ? (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 1,
                  ml: 1,
                  bgcolor: "#2f855a",
                  "&:hover": { bgcolor: "#276749" },
                }}
                onClick={() => openModal("login")}
              >
                Đăng nhập
              </Button>
            ) : (
              <>
                <IconButton
                  onClick={handleOpenDropdown}
                  size="large"
                  sx={{
                    ml: 1,
                    border: "1px solid transparent",
                    "&:hover": { border: "1px solid", borderColor: "#2f855a" },
                    color: "#2f855a",
                  }}
                  aria-label="User menu"
                >
                  <Avatar sx={{ bgcolor: "#2f855a" }}>
                    {userName ? userName.charAt(0).toUpperCase() : ""}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleCloseDropdown}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      minWidth: 180,
                      "& .MuiMenuItem-root": {
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseDropdown();
                      openProfileModal();
                    }}
                  >
                    Hồ sơ cá nhân
                  </MenuItem>
                  <MenuItem onClick={handleCloseDropdown}>Cài đặt</MenuItem>
                  <MenuItem onClick={handleCloseDropdown}>Thông báo</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "#e53e3e", fontWeight: 700 }}>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>

      {/* Modal đăng nhập/đăng ký/forgot/verify/new password */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        <Fade in={modalOpen}>
          <Box sx={styleModal}>
            <IconButton aria-label="close" onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
              ×
            </IconButton>

            {formType === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} switchForm={switchForm} />}
            {formType === "register" && <RegisterForm onRegisterSuccess={closeModal} switchForm={switchForm} />}
            {formType === "forgotPassword" && <ForgotPasswordForm switchForm={switchForm} />}
            {formType === "verify-code" && <VerifyCodeForm switchForm={switchForm} email={formParams.email} />}
            {formType === "newPassword" && (
              <NewPasswordForm switchForm={switchForm} email={formParams.email} verificationCode={formParams.verificationCode} />
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Modal hồ sơ cá nhân */}
      <Modal
        open={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileData(null);
          setProfileError(null);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
        aria-labelledby="profile-modal-title"
      >
        <Fade in={profileModalOpen}>
          <Box sx={{ ...styleModal, maxWidth: 500, maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
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
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Header;
