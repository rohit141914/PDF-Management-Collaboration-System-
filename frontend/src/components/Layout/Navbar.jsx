import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated as checkAuthenticated}
from "../../services/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = checkAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Box className="navbar-container">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className="navbar-title"
            onClick={handleTitleClick}
          >
            PDF Collaboration System
          </Typography>
          {isAuthenticated ? (
            <Box>
              <Button
                color="inherit"
                onClick={handleDashboard}
                className="navbar-dashboard-button"
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                className="navbar-logout-button"
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              color="inherit"
              onClick={handleLogout}
              className="navbar-logout-button"
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
