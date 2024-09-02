import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Navigation/Sidebar';
import Navbar from './Navigation/Navbar';
import Body from './Navigation/Body';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EditProfile from './HomeComponents/EditProfile';
import HomeViewComponent from './HomeView/HomeViewComponent';
import { auth } from './AuthComponents/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserProfile from './LeetCodeProfile/UserProfile';

// Export ColorModeContext so it can be imported in other components
export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('Home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {!isAuthenticated ? (
              <Route path="/" element={<HomeViewComponent />} />
            ) : (
              <Route
                path="/*"
                element={
                  <Box sx={{ display: 'flex', height: '100vh' }}>
                    <Sidebar
                      open={drawerOpen}
                      toggleDrawer={toggleDrawer}
                      onNavigation={handleNavigation}
                    />
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Navbar
                        open={drawerOpen}
                        onNavigation={handleNavigation}
                      />
                      <Routes>
                        <Route path="/" element={<Body activeComponent={activeComponent} />} />
                        <Route path="/problem/:titleSlug" element={<Body activeComponent="Questions" />} />
                        <Route path="/:component" element={<Navigate to="/" replace />} />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/leetcodestatus" element={<UserProfile />} />
                      </Routes>
                    </Box>
                  </Box>
                }
              />
            )}
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;