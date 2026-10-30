import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', p: 3 }}>
      <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>404</Typography>
      <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>Page not found</Typography>
      <Typography sx={{ color: '#999', mb: 4, maxWidth: 400 }}>
        The page you're looking for doesn't exist in CareNest. It may have been moved or removed.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/home')} sx={{ textTransform: 'none' }}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
