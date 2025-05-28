import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        PDF Management & Collaboration System
      </Typography>
      <Typography variant="h5" gutterBottom>
        Upload, share, and collaborate on PDF documents
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/register"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={RouterLink}
          to="/login"
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Home;