
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Stack,
} from "@mui/material";

const RegisterForm = ({ onRegisterSuccess, switchForm }) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetError = () => {
    if (error) {
      setError(false);
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage("");
    setLoading(true);

    if (!username || !fullName || !email || !password || !confirmPassword) {
      setMessage("Vui lòng điền đầy đủ thông tin.");
      setError(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu và nhập lại mật khẩu không khớp.");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password, phone }),
      });

      if (response.ok) {
        // Lấy permissions từ API /api/auth/user sau khi đăng ký
        const userResponse = await fetch('http://localhost:8080/api/auth/user', {
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('permissions', JSON.stringify(userData.permissions || []));
        } else {
          localStorage.removeItem('permissions');
        }

        setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setError(false);
        setUsername("");
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
        }, 2500);
      } else {
        const err = await response.text();
        setMessage(`Lỗi: ${err || "Đăng ký thất bại"}`);
        setError(true);
      }
    } catch (error) {
      setMessage("Lỗi kết nối server: " + error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
        color: "#333",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: "#2a9d8f", letterSpacing: 0.4 }}
      >
        Đăng ký tài khoản
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              resetError();
            }}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />
          <TextField
            label="Họ và tên đầy đủ"
            variant="outlined"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              resetError();
            }}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              resetError();
            }}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              resetError();
            }}
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              resetError();
            }}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />
          <TextField
            label="Nhập lại mật khẩu"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              resetError();
            }}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              sx: {
                fontWeight: 600,
                fontSize: 16,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#21867a",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2a9d8f",
                  boxShadow: "0 0 8px rgba(42,157,143,0.4)",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.8,
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(42, 157, 143, 0.6)",
              bgcolor: loading ? "#888" : "#2a9d8f",
              "&:hover": {
                bgcolor: loading ? "#888" : "#21867a",
              },
            }}
          >
            Đăng ký
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="text"
          onClick={() => switchForm && switchForm("login")}
          sx={{
            color: "#2a9d8f",
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
            userSelect: "none",
            "&:hover": { color: "#1b665a" },
          }}
        >
          ← Quay trở lại đăng nhập
        </Button>
      </Box>

      {message && (
        <Alert
          severity={error ? "error" : "success"}
          sx={{ mt: 2, fontWeight: 700, fontSize: 15, userSelect: "none" }}
        >
          {message}
        </Alert>
      )}
    </Paper>
  );
};
export default RegisterForm;
