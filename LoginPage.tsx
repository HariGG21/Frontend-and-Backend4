import api from './api'; // CORRECTED IMPORT PATH
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { AxiosError } from 'axios'; // Keep AxiosError for type
import { LoginRequest, LoginResponse, ApiErrorResponse } from './types/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      } as LoginRequest);
      console.log('Login successful:', response.data);
      localStorage.setItem('authToken', response.data.token);
      navigate('/products');
    } catch (error: any) { // Use 'any' for easier access to response
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display backend error message
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      console.error('Login failed:', error); // Log the error for debugging
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Button onClick={() => navigate('/register')} color="primary" size="small">Sign Up</Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;





































































