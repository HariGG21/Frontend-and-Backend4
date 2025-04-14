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
import { RegisterRequest, ApiErrorResponse } from './types/auth';

const RegisterPage: React.FC = () => {
  const [userName, setUserName] = useState<string>(''); // Renamed 'name'
  const [email, setEmail] = useState<string>(''); // Added email state
  const [password, setPassword] = useState<string>(''); // Added password state
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Added confirmPassword state
  const [error, setError] = useState<string>(''); // Error message state
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset previous errors
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await api.post('/auth/register', {
        name: userName,
        email,
        password,
      } as RegisterRequest);
      console.log('Registration successful:', response.data);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Error message */}

          {/* Name field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="Name"
            name="userName"
            autoComplete="name"
            autoFocus
            value={userName}
            onChange={(e) => setUserName(e.target.value)} // Update state
          />

          {/* Email field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />

          {/* Password field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state
          />

          {/* Confirm Password field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update state
          />

          {/* Sign Up button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          {/* Link to Login page */}
          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Button onClick={() => navigate('/login')} color="primary" size="small">
              Login
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;




