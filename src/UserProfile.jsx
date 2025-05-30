import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

const stylePaper = {
  maxWidth: 480,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: "none",
  maxHeight: "80vh",
  overflowY: "auto",
};

const UserProfile = ({ user, onClose, loading, error }) => {
  console.log("User data:", user); // Log để debug

  // Hàm kiểm tra và định dạng ngày sinh an toàn
  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam
    } catch (e) {
      console.error("Invalid date format:", dateStr, e);
      return "Chưa cập nhật";
    }
  };

  return (
    <Paper sx={stylePaper} onClick={(e) => e.stopPropagation()}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2, alignSelf: "center" }}>
            Đang tải hồ sơ...
          </Typography>
        </Box>
      ) : error ? (
        <>
          <Typography variant="h5" gutterBottom color="error">
            Lỗi
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={onClose} fullWidth>
            Đóng
          </Button>
        </>
      ) : user ? (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, color: "#2a9d8f", fontWeight: "700" }}
          >
            Hồ sơ cá nhân
          </Typography>
          <Stack spacing={1.5}>
            <Typography>
              <strong>Username:</strong> {user.username || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <strong>Full name:</strong> {user.fullName || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {user.phone || "Chưa cập nhật"}
            </Typography>
             <Typography>
              <strong>Vai trò:</strong>{" "}
              {user.roles && user.roles.length > 0 
                ? user.roles.join(", ") 
                : "Chưa có vai trò"}
            </Typography>
            <Typography>
              <strong>Ngày sinh:</strong> {formatDate(user.dateOfBirth)}
            </Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <strong>Trường học:</strong> {user.schoolName || "Chưa cập nhật"}
            </Typography>
           
          </Stack>
          <Button variant="contained" onClick={onClose} sx={{ mt: 4 }} fullWidth>
            Đóng
          </Button>
        </>
      ) : null}
    </Paper>
  );
};

export default UserProfile;