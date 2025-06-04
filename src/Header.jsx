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
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyCodeForm from "./VerifyCodeForm";
import NewPasswordForm from "./NewPasswordForm";
import Logo from "./assets/logo.jpg";
import { useNavigate } from "react-router-dom";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 440,
  bgcolor: "#fff",
  borderRadius: 4,
  boxShadow: 1,
  p: 2,
};

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [formType, setFormType] = useState("login");
  const [formParams, setFormParams] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [permissions, setPermissions] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const allMenus = {
    VIEW_HOME_PAGE: "Trang chủ",
    VIEW_COURSES: "Khóa học",
    VIEW_SURVEYS: "Khảo sát",
    BOOK_APPOINTMENTS: "Đặt lịch",
    VIEW_PROGRAMS: "Chương trình",
    VIEW_BLOGS: "Blog",
    VIEW_FAQ: "FAQ",
    VIEW_RISK_ASSESSMENTS: "Đánh giá rủi ro",
    MANAGE_BLOGS: "QL Blog",
    MANAGE_APPOINTMENTS: "QL Lịch hẹn",
    VIEW_PARTICIPANTS: "Người tham gia",
    VIEW_REPORTS: "Báo cáo",
    MANAGE_COURSES: "QL Khóa học",
    MANAGE_PROGRAMS: "QL Chương trình",
    MANAGE_CAMPAIGNS: "QL Chiến dịch",
    MANAGE_PARTICIPANTS: "QL Người tham gia",
    MANAGE_CONSULTANTS: "QL Chuyên viên",
    MANAGE_REPORTS: "QL Báo cáo",
    VIEW_USERS: "Xem người dùng",
    MANAGE_USERS: "QL Người dùng",
    MANAGE_FAQ: "QL FAQ",
    MANAGE_ORGANIZATIONS: "QL Tổ chức",
    VIEW_ACTIVITY_LOGS: "Lịch sử hoạt động",
  };

  const menuRoutes = {
    "Trang chủ": "/home",
    "Khóa học": "/courses",
    "Khảo sát": "/surveys",
    "Đặt lịch": "/appointments",
    "Chương trình": "/programs",
    "Blog": "/blogs",
    "FAQ": "/faq",
    "Đánh giá rủi ro": "/risk-assessments",
    "QL Blog": "/manage-blogs",
    "QL Lịch hẹn": "/manage-appointments",
    "Người tham gia": "/participants",
    "Báo cáo": "/reports",
    "QL Khóa học": "/manage-courses",
    "QL Chương trình": "/manage-programs",
    "QL Chiến dịch": "/manage-campaigns",
    "QL Người tham gia": "/manage-participants",
    "QL Chuyên viên": "/manage-consultants",
    "QL Báo cáo": "/manage-reports",
    "Xem người dùng": "/users",
    "QL Người dùng": "/manage-users",
    "QL FAQ": "/manage-faq",
    "QL Tổ chức": "/manage-organizations",
    "Lịch sử hoạt động": "/activity-logs",
  };

  const menuOrder = Object.values(allMenus);

  const fetchProfile = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/profile?email=${encodeURIComponent(email)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Lấy hồ sơ thất bại");
      return await response.json();
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/user", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", data.email || "");
          localStorage.setItem("userName", data.fullName || "");
          localStorage.setItem("userRole", data.role || "");
          localStorage.setItem("permissions", JSON.stringify(data.permissions || []));
          setUserName(data.fullName || "");
          setUserRole(data.role || "");
          setPermissions(data.permissions || []);
          if (data.email) {
            const profile = await fetchProfile(data.email);
            if (profile) setProfileData(profile);
          }
        } else {
          localStorage.clear();
          setIsLoggedIn(false);
          setUserName("");
          setUserRole("");
          setPermissions([]);
          setProfileData(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName("");
        setUserRole("");
        setPermissions([]);
        setProfileData(null);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/user", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("email", data.email || "");
          localStorage.setItem("userName", data.fullName || "");
          localStorage.setItem("userRole", data.role || "");
          localStorage.setItem("permissions", JSON.stringify(data.permissions || []));
          setUserName(data.fullName || "");
          setUserRole(data.role || "");
          setPermissions(data.permissions || []);
          if (data.email) {
            const profile = await fetchProfile(data.email);
            if (profile) setProfileData(profile);
          }
        }
      } catch (error) {
        console.error("Error updating login status:", error);
      }
    };
    window.addEventListener("loginSuccess", handleLoginSuccess);
    return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
  }, []);

  useEffect(() => {
    const handleLogoutSuccess = () => {
      setIsLoggedIn(false);
      localStorage.clear();
      setUserName("");
      setUserRole("");
      setPermissions([]);
      setProfileData(null);
      navigate("/home");
    };
    window.addEventListener("logoutSuccess", handleLogoutSuccess);
    return () => window.removeEventListener("logoutSuccess", handleLogoutSuccess);
  }, [navigate]);

  const openModal = (type) => {
    setFormType(type);
    setFormParams({});
    setModalOpen(true);
    setDrawerOpen(false);
  };
  const closeModal = () => setModalOpen(false);
  const switchForm = (type, params = {}) => {
    setFormType(type);
    setFormParams(params);
  };

  const handleLoginSuccess = async () => {
    try {
      const email = localStorage.getItem("email");
      setIsLoggedIn(true);
      if (email) {
        const profile = await fetchProfile(email);
        if (profile) setProfileData(profile);
      }
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lấy profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        localStorage.clear();
        setUserName("");
        setUserRole("");
        setPermissions([]);
        setProfileData(null);
        setAnchorEl(null);
        setDrawerOpen(false);
        window.dispatchEvent(new Event("logoutSuccess"));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const openProfileModal = async () => {
    setAnchorEl(null);
    setProfileModalOpen(true);
    if (profileData) return;
    setProfileLoading(true);
    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("Không tìm thấy email");
      const profile = await fetchProfile(email);
      if (profile) setProfileData(profile);
      else throw new Error("Không lấy được hồ sơ");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const getMenusForPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) {
      return { mainMenuItems: ["Trang chủ", "Chương trình", "Blog", "FAQ"] };
    }

    const menuItems = permissions
      .filter((perm) => allMenus[perm])
      .map((perm) => allMenus[perm])
      .sort((a, b) => menuOrder.indexOf(a) - menuOrder.indexOf(b));

    return { mainMenuItems: [...new Set(menuItems)] };
  };

  const { mainMenuItems } = getMenusForPermissions(permissions);

  const handleOpenDropdown = (event) => setAnchorEl(event.currentTarget);
  const handleCloseDropdown = () => setAnchorEl(null);

  const handleOpenMoreMenu = (event) => setMoreMenuAnchorEl(event.currentTarget);
  const handleCloseMoreMenu = () => setMoreMenuAnchorEl(null);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const drawerMenu = (
    <Box sx={{ width: 250, bgcolor: "#fff" }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {mainMenuItems.map((item) => (
          <ListItemButton key={item} onClick={() => menuRoutes[item] && navigate(menuRoutes[item])}>
            <ListItemText primary={item} primaryTypographyProps={{ fontWeight: "bold", color: "#333" }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const maxVisibleItems = 12;
  const visibleMenuItems = mainMenuItems.slice(0, maxVisibleItems);
  const moreMenuItems = mainMenuItems.slice(maxVisibleItems);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#f9fafb", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }} onClick={() => navigate("/home")}>
            <Box component="img" src={Logo} alt="Phòng Chống Ma Túy" sx={{ height: 48, borderRadius: 1 }} />
            <Typography variant="h6" color="#2f855a" sx={{ userSelect: "none", lineHeight: 1.2 }}>
              Phòng Ngừa<br />Ma Túy
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1, gap: 2 }}>
              {visibleMenuItems.map((item) => (
                <Typography
                  key={item}
                  variant="button"
                  sx={{
                    cursor: "pointer",
                    color: "#222",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    "&:hover": { color: "#2f855a", textDecoration: "underline" },
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => menuRoutes[item] && navigate(menuRoutes[item])}
                >
                  {item}
                </Typography>
              ))}
              {moreMenuItems.length > 0 && (
                <>
                  <Typography
                    variant="button"
                    sx={{
                      cursor: "pointer",
                      color: "#222",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      "&:hover": { color: "#2f855a", textDecoration: "underline" },
                      whiteSpace: "nowrap",
                    }}
                    onClick={handleOpenMoreMenu}
                  >
                    Thêm
                  </Typography>
                  <Menu
                    anchorEl={moreMenuAnchorEl}
                    open={moreMenuOpen}
                    onClose={handleCloseMoreMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      sx: { borderRadius: 2, minWidth: 180, "& .MuiMenuItem-root": { fontWeight: 600 } },
                    }}
                  >
                    {moreMenuItems.map((item) => (
                      <MenuItem
                        key={item}
                        onClick={() => {
                          handleCloseMoreMenu();
                          menuRoutes[item] && navigate(menuRoutes[item]);
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton color="#2f855a" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isLoggedIn ? (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 1,
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
                  sx={{ "&:hover": { border: "1px solid #2f855a" } }}
                >
                  <Avatar sx={{ bgcolor: "#2f855a" }}>
                    {userName ? userName.charAt(0).toUpperCase() : ""}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseDropdown}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: { borderRadius: 2, minWidth: 180, "& .MuiMenuItem-root": { fontWeight: 600 } },
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
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "#e53e3e" }}>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={modalOpen}>
          <Box sx={styleModal}>
            <IconButton onClick={closeModal} sx={{ position: "absolute", right: 8, top: 8 }}>
              ×
            </IconButton>
            {formType === "login" && (
              <LoginForm onLoginSuccess={handleLoginSuccess} switchForm={switchForm} />
            )}
            {formType === "register" && (
              <RegisterForm onRegisterSuccess={closeModal} switchForm={switchForm} />
            )}
            {formType === "forgotPassword" && <ForgotPasswordForm switchForm={switchForm} />}
            {formType === "verify-code" && (
              <VerifyCodeForm switchForm={switchForm} email={formParams.email} />
            )}
            {formType === "newPassword" && (
              <NewPasswordForm
                switchForm={switchForm}
                email={formParams.email}
                verificationCode={formParams.verificationCode}
              />
            )}
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
          setProfileError(null);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: {

 timeout: 500 } }}
      >
        <Fade in={profileModalOpen}>
          <Box sx={{ ...styleModal, maxWidth: 500, maxHeight: "80vh", overflowY: "auto" }}>
            <UserProfile
              user={profileData}
              loading={profileLoading}
              error={profileError}
              onClose={() => {
                setProfileModalOpen(false);
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