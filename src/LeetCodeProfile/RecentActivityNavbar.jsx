import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForumIcon from '@mui/icons-material/Forum';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const RecentActivityNavbar = ({ onSelect, isDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const darkModeStyles = {
    appBar: {
      backgroundColor: isDarkMode ? '#121212' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      boxShadow: isDarkMode ? '' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    iconButton: {
      color: isDarkMode ? '#fff' : 'inherit',
    },
    typography: {
      color: isDarkMode ? '#fff' : '#000',
    },
    link: {
      color: isDarkMode ? '#fff' : '#000',
    },
  };

  const NavItem = ({ icon, label, onClick }) => (
    <>
      <IconButton 
        aria-label={label} 
        onClick={() => onSelect(onClick)}
        style={darkModeStyles.iconButton}
      >
        {icon}
      </IconButton>
      <a 
        href="#" 
        style={{ 
          textDecoration: 'none', 
          marginLeft: 8, 
          marginRight: 16,
          ...darkModeStyles.link
        }} 
        onClick={(e) => { e.preventDefault(); onSelect(onClick); }}
      >
        {!isMobile && (
          <Typography variant="body1" style={darkModeStyles.typography}>
            {label}
          </Typography>
        )}
      </a>
    </>
  );

  return (
    <AppBar position="static" style={darkModeStyles.appBar}>
      <Toolbar>
        <Box display="flex" alignItems="center" width="100%">
          <NavItem 
            icon={<HomeIcon style={{ color: isDarkMode ? '#ff6b6b' : '#f44336' }} />} 
            label="Recent AC" 
            onClick="recent" 
          />
          <NavItem 
            icon={<ListIcon style={{ color: isDarkMode ? '#4da6ff' : '#2196f3' }} />} 
            label="List" 
            onClick="list" 
          />
          <NavItem 
            icon={<CheckCircleIcon style={{ color: isDarkMode ? '#66bb6a' : '#4caf50' }} />} 
            label="Solutions" 
            onClick="solutions" 
          />
          <NavItem 
            icon={<ForumIcon style={{ color: isDarkMode ? '#ffa726' : '#ff9800' }} />} 
            label="Discuss" 
            onClick="discuss" 
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default RecentActivityNavbar;