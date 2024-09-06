import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  useMediaQuery,
  Drawer,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FeaturesIcon from '@mui/icons-material/Stars';
import LoginIcon from '@mui/icons-material/Login';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SpeedIcon from '@mui/icons-material/Speed';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MenuIcon from '@mui/icons-material/Menu';
import AuthModal from '../AuthComponents/AuthModel';
import { BoxRevealDemo } from '../TsComponents/BoxRevealDemo';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../apiClient';

const profileImage = '/me2.jpg';

const features = [
  { icon: <CodeIcon />, text: 'Practice Portal - Run & Submit Code' },
  { icon: <LanguageIcon />, text: 'Multi-Language Support - Java, C, C++, JavaScript, Python' },
  { icon: <QuestionAnswerIcon />, text: 'AI-Assisted Doubt Portal' },
  { icon: <RateReviewIcon />, text: 'Code Review - Improve your code to industry standards' },
  { icon: <SpeedIcon />, text: 'Complexity Analysis - Evaluate time and space efficiency' },
  { icon: <EditIcon />, text: 'Rich Text Editor - Save notes in your preferred style' },
  { icon: <TrendingUpIcon />, text: 'Progress Tracking - Monitor your advancement' },
  { icon: <EmojiEventsIcon />, text: 'Leaderboard - Compete with others or opt-out (coming soon)' },
  { icon: <GroupIcon />, text: 'Exclusive Community discussions and Forum' },
  { icon: <PersonIcon />, text: 'Profile DashBoard' },
  { icon: <EqualizerIcon />, text: 'LeetCode statistics in detail' },
];

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(15, 0),
  borderRadius: 0,
  marginBottom: theme.spacing(8),
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 5px 15px rgba(255, 255, 255, 0.1)'
    : '0 5px 15px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 0),
  },
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
}));

const HeroImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  right: '-5%',
  bottom: '-10%',
  width: '50%',
  maxWidth: '500px',
  transform: 'rotate(10deg)',
  opacity: 0.7,
  filter: theme.palette.mode === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'rotate(5deg) scale(1.05)',
    opacity: 1,
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #424242 30%, #616161 90%)'
    : 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 5px 2px rgba(255, 255, 255, 0.3)'
    : '0 3px 5px 2px rgba(0, 0, 0, 0.3)',
  color: theme.palette.text.primary,
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(2, 2, 2, 0),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 6px 10px 4px rgba(255, 255, 255, 0.5)'
      : '0 6px 10px 4px rgba(0, 0, 0, 0.5)',
  },
}));

const GlobalStyles = styled('style')({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0,0,0,0.1) transparent',
    },
  },
});

export default function HomeViewComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarring, setIsStarring] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLogin = () => {
    setOpenModal(false);
    navigate('/home');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleMobileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const starredStatus = localStorage.getItem('repoStarred');
    if (starredStatus === 'true') {
      setIsStarred(true);
    }
  }, []);

  const handleStarRepo = useCallback(async () => {
    if (isStarred || isStarring) return;

    setIsStarring(true);
    setIsStarred(true);

    try {
      const response = await apiClient.post('https://takeuforward-plus-clone.onrender.com/api/star-repo');
      if (response.status === 200) {
        setIsStarred(true);
        localStorage.setItem('repoStarred', 'true');
        toast.success("Thank you for rating my work!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            setIsStarred(false);
          }
        });
      }
    } catch (error) {
      setIsStarred(false);
      localStorage.removeItem('repoStarred'); 
      toast.error("Failed to star the repository. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsStarring(false);
    }
  }, [isStarred, isStarring]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#f5f5f5',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0bec5' : '#757575',
      },
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        <AppBar position="fixed" elevation={0} sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <Toolbar>
            <img 
              src="/logo.png" 
              alt="TUF+" 
              style={{height: isMobile ? '40px' : '65px', width: 'auto', padding: '4px'}}
            />
            <Box sx={{ flexGrow: 1 }} />
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMobileMenuClose}
                >
                  <MenuItem onClick={() => { window.open('https://github.com/dileepverma107', '_blank'); handleMobileMenuClose(); }}>
                    <GitHubIcon sx={{ mr: 1 }} /> GitHub
                  </MenuItem>
                  <MenuItem onClick={() => { window.open('https://www.linkedin.com/in/dileep-verma-35a319139/', '_blank'); handleMobileMenuClose(); }}>
                    <LinkedInIcon sx={{ mr: 1 }} /> LinkedIn
                  </MenuItem>
                  <MenuItem onClick={() => { window.open('https://x.com/nextgensolver', '_blank'); handleMobileMenuClose(); }}>
                    <TwitterIcon sx={{ mr: 1 }} /> Twitter
                  </MenuItem>
                  <MenuItem onClick={() => { window.open('https://www.instagram.com/dileepverma107/', '_blank'); handleMobileMenuClose(); }}>
                    <InstagramIcon sx={{ mr: 1 }} /> Instagram
                  </MenuItem>
                  <MenuItem onClick={() => { toggleDarkMode(); handleMobileMenuClose(); }}>
                    {darkMode ? <LightModeIcon sx={{ mr: 1 }} /> : <DarkModeIcon sx={{ mr: 1 }} />} 
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </MenuItem>
                  <MenuItem onClick={() => { handleStarRepo(); handleMobileMenuClose(); }} disabled={isStarred || isStarring}>
                    {isStarred ? <StarIcon sx={{ mr: 1, color: '#FFD700' }} /> : <StarBorderIcon sx={{ mr: 1 }} />}
                    Star Repository
                  </MenuItem>
                  <MenuItem onClick={() => { handleOpenModal(); handleMobileMenuClose(); }}>
                    <LoginIcon sx={{ mr: 1 }} /> Login
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton color="inherit" href="https://github.com/dileepverma107" target="_blank">
                  <GitHubIcon />
                </IconButton>
                <IconButton color="inherit" href="https://www.linkedin.com/in/dileep-verma-35a319139/" target="_blank">
                  <LinkedInIcon />
                </IconButton>
                <IconButton color="inherit" href="https://x.com/nextgensolver" target="_blank">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="inherit" href="https://www.instagram.com/dileepverma107/" target="_blank">
                  <InstagramIcon />
                </IconButton>
                <IconButton onClick={toggleDarkMode} color="inherit">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Tooltip id="star-tooltip" />
                <IconButton
                  color="inherit"
                  onClick={handleStarRepo}
                  data-tooltip-id="star-tooltip"
                  data-tooltip-content={isStarred ? "You've starred this repo" : "Star this repo on GitHub"}
                  disabled={isStarred || isStarring}
                >
                  {isStarred ? (
                    <StarIcon sx={{ color: '#FFD700' }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
                <IconButton onClick={handleOpenModal} sx={{ mr: 2 }}>
                  <LoginIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
        <HeroSection>
          <HeroContent maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={9}>
                <BoxRevealDemo />
              </Grid>
            </Grid>
          </HeroContent>
          <HeroImage src={profileImage} alt="Coding Hero" />
        </HeroSection>
        <Container component="main" maxWidth="lg" sx={{ mb: 8, flexGrow: 1 }}>
          <Grid container spacing={4} sx={{ mt: 8 }}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ 
                p: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.palette.mode === 'dark' ? '0 5px 15px rgba(255, 255, 255, 0.1)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
              }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                  <FeaturesIcon sx={{ fontSize: 40, mb: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h4" component="h2" align="center" sx={{
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                  }}>
                    Features available in this clone
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ListItem>
                        <ListItemIcon sx={{ color: theme.palette.secondary.main }}>{feature.icon}</ListItemIcon>
                        <ListItemText primary={feature.text} sx={{ color: theme.palette.text.primary }} />
                      </ListItem>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Box component="footer" sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              {'Copyright © '}
              {new Date().getFullYear()}
              {' TUF+ Clone. All rights reserved.'}
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <IconButton color="inherit" href="https://github.com/dileepverma107" target="_blank">
                <GitHubIcon />
              </IconButton>
              <IconButton color="inherit" href="https://www.linkedin.com/in/dileep-verma-35a319139/" target="_blank">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" href="https://x.com/nextgensolver" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" href="https://www.instagram.com/dileepverma107/" target="_blank">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Container>
        </Box>
        <AuthModal 
          open={openModal} 
          handleClose={handleCloseModal}
          onLogin={handleLogin}
        />
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}