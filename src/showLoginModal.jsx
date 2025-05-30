import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginForm from "./LoginForm";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 480,
  width: "90vw",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  outline: "none",
};

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            px: { xs: 2, sm: 4 },
          }}
        >
          {/* Logo và menu trái */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component="img"
              src="/path-to-logo.jpg"
              alt="Phòng Chống Ma Túy"
              sx={{ height: 48 }}
            />
            <Typography
              variant="h6"
              sx={{
                userSelect: "none",
                whiteSpace: "nowrap",
                lineHeight: 1.1,
                color: "primary.main",
                fontWeight: 700,
              }}
            >
              Phòng Chống
              <br />
              Ma Túy
            </Typography>

            {/* Menu chính, ẩn trên xs */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", sm: "flex" }, ml: 4 }}
            >
              {[
                "Sản phẩm",
                "Giải pháp",
                "Cộng đồng",
                "Tài nguyên",
                "Bảng giá",
                "Liên hệ",
              ].map((item) => (
                <Typography
                  key={item}
                  variant="button"
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    color: "text.primary",
                    fontWeight: 600,
                    "&:hover": { color: "primary.main", textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Nút đăng nhập / đăng ký */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowLoginModal(true)}
              sx={{ fontWeight: 700 }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700 }}
              onClick={() => alert("Chức năng đăng ký đang phát triển")}
            >
              Đăng ký
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Modal đăng nhập */}
      <Modal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        closeAfterTransition
        slots={{ backdrop: "div" }}
      >
        <Box sx={styleModal}>
          <IconButton
            aria-label="close"
            onClick={() => setShowLoginModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <LoginForm onLoginSuccess={() => setShowLoginModal(false)} />
        </Box>
      </Modal>
    </>
  );
};

export default Header;
