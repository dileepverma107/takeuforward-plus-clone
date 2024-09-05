import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  LinearProgress,
  Button,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, onSnapshot, doc, collection } from 'firebase/firestore';
import { auth, db } from '../AuthComponents/Firebase'; // Adjust the path as needed
import AuthModal from '../AuthComponents/AuthModel';
import ProfileMenu from './ProfileMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { FaAward } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ColorModeContext } from '../App';

const drawerWidth = 240;

const Logo = styled('div')(({ theme }) => ({
  fontWeight: '700',
  fontSize: '2rem',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#d41f30',
}));

const ProgressDisplay = ({ currentDay, totalDays, currentPoints, totalPoints }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarTodayIcon fontSize="small" />
        <Typography variant="body2">Day {currentDay}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={(currentDay / totalDays) * 100} 
        sx={{ 
          flexGrow: 1,
          height: 12,
          borderRadius: 3,
          backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#E0E0E0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#22C55E'
          }
        }} 
      />
      <Typography variant="body2">Day {totalDays}</Typography>
      <FaAward style={{fontSize:'2.3rem', border:`1px solid ${theme.palette.mode === 'dark' ? '#555' : '#D5D5D9'}`, borderRadius:'50%', padding:'8px', color:'#FFB636'}}/>
      <LinearProgress 
        variant="determinate" 
        value={(currentPoints / totalPoints) * 100} 
        sx={{ 
          flexGrow: 1,
          height: 12,
          borderRadius: 3,
          backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#E0E0E0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#22C55E'
          }
        }} 
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="success.main">{currentPoints}</Typography>
        <Typography variant="body2">/</Typography>
        <Typography variant="body2">{totalPoints}</Typography>
      </Box>
    </Box>
  );
};

const Navbar = ({ open }) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [currentDay, setCurrentDay] = useState(0);
  const [totalDays, setTotalDays] = useState(195);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(auth);
      console.log(currentUser);
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfileImage(userDoc.data().profileImage);
        }
      } else {
        setProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const userQuestionsDoc = doc(db, 'userQuestions', user.uid);
    const questionsCollection = collection(userQuestionsDoc, 'questions');
    const unsubscribe = onSnapshot(questionsCollection, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(data);
       
        const total = data.reduce((sum, question) => sum + (question.points || 0), 0);
        setCurrentPoints(total);
        setTotalPoints(data.length * 100);
      } else {
        console.log('No questions found for this user');
      }
    }, (error) => {
      console.error('Error fetching questions:', error);
    });
    return () => unsubscribe();
  
  }, [user]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleLogin = () => {
    handleCloseModal();
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileImage(null);
    handleProfileClose();
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          transition: theme =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!open &&  <img 
              src="/logo.png" 
              alt="TUF+" 
              style={{height:'65px', width:'510x', padding:'4px'}} // Adjust the size according to your needs
            />}

          <Box sx={{ flexGrow: 1, mx: 2, display: 'flex', justifyContent: 'center' }}>
            {open ? (
              <ProgressDisplay 
                currentDay={currentDay}
                totalDays={totalDays}
                currentPoints={currentPoints}
                totalPoints={totalPoints}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', marginLeft:'100px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">Day {currentDay}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={2} 
                  sx={{ 
                    flexGrow: 1, 
                    maxWidth: '900px',
                    height: 12,
                    borderRadius: 2, 
                    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#22C55E'
                    }
                  }} 
                />
                <Typography variant="body2">Day {totalDays}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <MdDarkMode /> : <MdOutlineLightMode />}
            </IconButton>
            {user ? (
              <Avatar 
                alt="Profile Picture" 
                src={profileImage || user.photoURL || "https://via.placeholder.com/40"}
                onClick={handleProfileClick}
                sx={{ cursor: 'pointer' }}
              />
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleOpenModal}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <AuthModal 
        open={openModal} 
        handleClose={handleCloseModal}
        onLogin={handleLogin}
      />
      <ProfileMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
        userName={user ? user.displayName || "User" : ""}
        profileImage={profileImage}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;