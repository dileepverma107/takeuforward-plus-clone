import React from 'react';
import { Box, Typography,useTheme } from '@mui/material';
import ProblemSolvingPage from '../CodeWorkspace/ProblemSolvingPage';
import { useLocation, useParams } from 'react-router-dom';
import DiscussionForum from '../DiscussionForum/DiscussionForum';
import ConfettiButton from '../ConfettiButton';
import WorkInProgress from '../WorkInProgress';
import Home from '../HomeComponents/Home';

const Body = ({ activeComponent }) => {
  const { titleSlug } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const renderComponent = () => {
    if (location.pathname.startsWith('/problem/')) {
      return <ProblemSolvingPage titleSlug={titleSlug}/>;
    }

    switch (activeComponent) {
      case 'Home':
        return <Home isDarkMode={isDarkMode}/>;
      case 'Discussion':
        return <DiscussionForum isDarkMode={isDarkMode}/>;
      case 'Roadmap':
        return <Typography variant="h4" style={{textAlign:'center', marginTop:'250px'}}>Build in progress</Typography>;
      case 'Session':
        return <Typography variant="h4" style={{textAlign:'center', marginTop:'250px'}}>Build in progress</Typography>;
      default:
        return <Typography variant="h4">Select a component from the sidebar</Typography>;
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        height: '100vh', // Full height of the viewport
        overflow: 'auto', // Changed from 'hidden' to 'auto'
        mt: 0,
        backgroundColor: isDarkMode ? 'black' : '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // Added position relative
      }}
    >
      <Box
        sx={{
          position: 'absolute', // Position absolute
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowX: 'hidden', // Hide horizontal overflow
          overflowY: 'hidden', // Allow vertical scrolling if needed
        }}
      >
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Body;