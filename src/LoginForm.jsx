import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Alert, Divider } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess, switchForm }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch('http://localhost:8080/api/auth/login-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage('Google login failed: ' + errorText);
        setError(true);
        return;
      }

      const data = await response.json();
      if (data.roles) {
        const roleNames = data.roles.map((role) => role.roleName || role);
        localStorage.setItem('roles', JSON.stringify(roleNames));
      } else {
        localStorage.removeItem('roles');
      }
      if (data.fullName) localStorage.setItem('userName', data.fullName);
      if (data.email) localStorage.setItem('email', data.email);

      const profileResponse = await fetch(
        `http://localhost:8080/api/auth/profile?email=${encodeURIComponent(data.email)}`,
        { credentials: 'include' }
      );
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.profile) {
          localStorage.setItem('userType', profileData.profile.userType || '');
          localStorage.setItem('dateOfBirth', profileData.profile.dateOfBirth || '');
        }
      }
      setMessage('Đăng nhập thành công bằng Google');
      setError(false);

      window.dispatchEvent(new Event('loginSuccess')); // Thêm sự kiện

      if (onLoginSuccess) {
        onLoginSuccess();
        navigate('/home');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setMessage('Lỗi kết nối server: ' + error.message);
      setError(true);
    }
  };

  const handleGoogleFailure = () => {
    setMessage('Đăng nhập Google thất bại');
    setError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMessage('');
    setLoading(true);

    if (!email || !password) {
      setMessage('Vui lòng nhập email và mật khẩu.');
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.roles) localStorage.setItem('roles', JSON.stringify(data.roles));
        else localStorage.removeItem('roles');
        if (data.fullName) localStorage.setItem('userName', data.fullName);
        if (data.email) localStorage.setItem('email', data.email);

        const profileResponse = await fetch(
          `http://localhost:8080/api/auth/profile?email=${encodeURIComponent(data.email)}`,
          { credentials: 'include' }
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          localStorage.setItem('userType', profileData.userType || '');
          localStorage.setItem('dateOfBirth', profileData.dateOfBirth || '');
          localStorage.setItem('phone', profileData.phone || '');
        }

        setMessage('Đăng nhập thành công');
        setError(false);

        window.dispatchEvent(new Event('loginSuccess')); // Thêm sự kiện

        if (onLoginSuccess) onLoginSuccess();
        navigate('/home');
      } else {
        const err = await response.text();
        setMessage(`Lỗi: ${err || 'Email hoặc mật khẩu không đúng'}`);
        setError(true);
      }
    } catch (error) {
      setMessage('Lỗi kết nối server: ' + error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: 'none',
        textAlign: 'center',
        color: '#333',
      }}
    >
      <Typography variant='h4' component='h2' sx={{ fontWeight: '700', mb: 4, color: '#2a9d8f' }}>
        Đăng nhập tài khoản
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label='Email'
            type='email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={loading}
            InputProps={{ sx: { fontWeight: 600, fontSize: 16 } }}
          />
          <TextField
            label='Mật khẩu'
            type='password'
            variant='outlined'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
            InputProps={{ sx: { fontWeight: 600, fontSize: 16 } }}
          />
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{
              py: 1.8,
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              bgcolor: '#2a9d8f',
              '&:hover': { bgcolor: '#21867a' },
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </Stack>
      </Box>
      <Stack direction='row' alignItems='center' spacing={1} sx={{ my: 3, userSelect: 'none' }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography sx={{ color: '#888', fontSize: 14, whiteSpace: 'nowrap' }}>
          Tiếp tục với
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          useOneTap
          width={40}
          shape='circle'
        />
      </Box>
      <Box sx={{ textAlign: 'center', fontSize: 14, userSelect: 'none' }}>
        <Typography
          component='span'
          onClick={() => switchForm && switchForm('forgotPassword')}
          sx={{
            cursor: 'pointer',
            color: '#2a9d8f',
            textDecoration: 'underline',
            mx: 1,
            '&:hover': { color: '#145a4e' },
          }}
        >
          Quên mật khẩu?
        </Typography>
        <Typography component='span'>|</Typography>
        <Typography
          component='span'
          onClick={() => switchForm && switchForm('register')}
          sx={{
            cursor: 'pointer',
            color: '#2a9d8f',
            textDecoration: 'underline',
            mx: 1,
            '&:hover': { color: '#145a4e' },
          }}
        >
          Tạo tài khoản mới
        </Typography>
      </Box>
      {message && (
        <Alert severity={error ? 'error' : 'success'} sx={{ mt: 2, fontWeight: 600, fontSize: 15 }}>
          {message}
        </Alert>
      )}
    </Paper>
  );
};

export default LoginForm;