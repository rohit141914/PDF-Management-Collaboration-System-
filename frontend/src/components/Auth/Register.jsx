import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, setAuthToken } from "../../services/auth";
import { TextField, Button, Container, Typography, Box, Link,}
from "@mui/material";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, username, password });
      const response = await login({ email, password });
      setAuthToken(response.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="auth-container">
        <Typography component="h1" variant="h5" className="auth-title">
          Sign up
        </Typography>
        {error && <Typography className="auth-error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} className="auth-form">
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
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            className="auth-submit-button"
          >
            Sign Up
          </Button>
          <Link href="/login" variant="body2" className="auth-link">
            Already have an account? Sign in
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
