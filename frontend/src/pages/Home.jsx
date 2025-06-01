import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import "./Pages.css";

const Home = () => {
  return (
    <Box className="home-container">
      <Typography variant="h2" gutterBottom className="home-title">
        PDF Management & Collaboration System
      </Typography>
      <Typography variant="h5" gutterBottom className="home-subtitle">
        Upload, share, and collaborate on PDF documents
      </Typography>
      <Box className="home-buttons-container">
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/register"
          className="home-get-started-button"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/login"
          className="home-login-button"
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
