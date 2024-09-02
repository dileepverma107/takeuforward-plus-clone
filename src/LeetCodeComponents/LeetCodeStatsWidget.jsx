import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  TextField, 
  Box, 
  Typography,
  IconButton,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

const LeetCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="#FFA116">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.981 2.337 1.494 3.834 1.494 1.498 0 2.853-.513 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zm4.709-4.92H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
  </svg>
);
const DarkLeetCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="#EFEAEA">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.981 2.337 1.494 3.834 1.494 1.498 0 2.853-.513 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zm4.709-4.92H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
  </svg>
);

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10%',
  width: 40,
  height: 40,
  minWidth: 30,
  backgroundColor: theme.palette.mode === 'dark' ? '#D41F30' : '#282C34',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#D41F30' : '#121212',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, #1e1e1e, #2a2a2a)' 
      : 'linear-gradient(145deg, #f0f0f0, #ffffff)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(255, 255, 255, 0.3)',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#282C34',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D41F30',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#D41F30',
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  },
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: '#D41F30',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#FF9000',
  },
}));

const LeetCodeStatsWidget = ({ isDarkMode }) => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleGenerate = () => {
      if (username.trim() === '') {
        setSnackbarOpen(true);
      } else {
        console.log(`Generating stats for user: ${username}`);
        setLoading(true);
        apiClient.post('', {
          operationName: "GetLeetCodeProfileData",
          variables: { username },
          query: `query GetLeetCodeProfileData($username: String!) { allQuestionsCount { difficulty count } matchedUser(username: $username) { username profile { realName userAvatar ranking reputation solutionCount contestCount postViewCount categoryDiscussCount } submissionCalendar submitStats { acSubmissionNum { difficulty count submissions } totalSubmissionNum { difficulty count submissions } } badges { displayName icon } languageProblemCount { languageName problemsSolved } tagProblemCounts { advanced { tagName tagSlug problemsSolved } intermediate { tagName tagSlug problemsSolved } fundamental { tagName tagSlug problemsSolved } } userCalendar { activeYears streak totalActiveDays submissionCalendar } } recentAcSubmissionList(username: $username) { id title titleSlug timestamp lang statusDisplay } }`,
        })
        .then((response) => {
          if (response.data.errors) {
            setError(response.data.errors[0].message);
            setLoading(false);
            return;
          }
          handleClose();
          console.log(response.data.data);
          navigate('/leetcodestatus', { state: { homeData: response.data.data } });
        })
        .catch((error) => {
          setError('Failed to fetch data. Please try again.');
          setLoading(false);
        });
       
      }
    };
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };

    const theme = createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
      },
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <StyledButton onClick={handleOpen}>
            {isDarkMode ? <DarkLeetCodeIcon />:<LeetCodeIcon />}
          </StyledButton>
        </motion.div>

        <StyledDialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <StyledDialogContent>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <CloseIcon />
            </IconButton>
            <LeetCodeIcon />
            <Typography variant="h5" component="h2" sx={{ mt: 2, fontWeight: 'bold', color: theme.palette.text.primary }}>
              Leetcode Statistics
            </Typography>
            <StyledTextField
              autoFocus
              margin="dense"
              id="username"
              label="Enter LeetCode username"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <GenerateButton
              onClick={handleGenerate}
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Generate Stats'}
            </GenerateButton>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </StyledDialogContent>
        </StyledDialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
            Please enter a username before generating stats.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default LeetCodeStatsWidget;