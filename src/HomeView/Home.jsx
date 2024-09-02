import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../Navigation/Sidebar';
import Navbar from '../Navigation/Navbar';
import Body from '../Navigation/Body';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import EditProfile from '../HomeComponents/EditProfile';
import EditProfileComponent from '../HomeComponents/EditProfile';

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getActiveComponent = () => {
    if (location.pathname.startsWith('/home/problem/')) {
      return 'Questions';
    }
    // Add more conditions here if needed for other routes
    return 'Home';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar
          open={drawerOpen}
        />
        <Body activeComponent={getActiveComponent()}>
          <Routes>
            <Route path="/" element={<Body activeComponent={getActiveComponent()} />} />
            <Route path="/problem/:titleSlug" element={<Body activeComponent="Questions" />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            
          </Routes>
        </Body>
      </Box>
    </Box>
  );
};

export default Home;