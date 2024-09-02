import React, { useState } from 'react';
import GoogleButton from 'react-google-button'
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Grid,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuUserSquare } from "react-icons/lu";
import { auth, googleProvider, db } from '../AuthComponents/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 550,
  maxHeight: '97vh',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  overflowY: 'auto',

  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#EA2E53',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: '#D43B1B',
    },
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: 'grey',
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '2.5rem',
  color: '#EA2E53',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: 45,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#999',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EE4B2B',
    },
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  color: '#EA2E53',
}));

const AuthModal = ({ open, handleClose, onLogin }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setIsForgotPassword(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      if (isSignIn) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Check if email is verified
        if (!user.emailVerified) {
          toast.error('Please verify your email before logging in.');
          // Optionally, you can send another verification email here
          await sendEmailVerification(user);
          toast.info('A new verification email has been sent. Please check your inbox.');
          return;
        }
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (!userDoc.exists()) {
          // If user doesn't exist in Firestore, create a new document
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            emailVerified: user.emailVerified,
            // You might want to prompt for these in a separate step
            username: user.displayName || '',
            fullName: user.displayName || '',
          });
        }
        
        console.log('User signed in successfully');
        toast.success('Logged in successfully!');
        setTimeout(() => {
          onLogin();
          handleClose();
        }, 1000);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await sendEmailVerification(user);
        
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: username,
          fullName: fullName,
          emailVerified: false
        });
        
        console.log('User registered successfully', user);
        toast.success('Registration successful! Please check your email to verify your account.');
        handleClose();
      }
    } catch (error) {
      setError(error.message);
      console.error('Authentication error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: user.displayName || '',
          fullName: user.displayName || '',
          emailVerified: user.emailVerified
        });
      }
      
      console.log('Google sign in successful', user);
      toast.success('Signed in with Google successfully!');
      setTimeout(() => {
        onLogin();
        handleClose();
      }, 1000);
    } catch (error) {
      setError(error.message);
      console.error('Google sign in error:', error);
      toast.error('Google sign in failed. Please try again.');
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Please check your inbox.');
      setIsForgotPassword(false);
    } catch (error) {
      setError(error.message);
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal open={open} onClose={handleClose}>
        <ModalContent>
          <CloseButton onClick={handleClose}>
            <IoIosCloseCircleOutline size={35} />
          </CloseButton>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {isForgotPassword 
                ? "Reset your password" 
                : isSignIn 
                  ? "Welcome back to" 
                  : "Ready to begin your journey with"}
            </Typography>
            <Logo>takeUAhead</Logo>
          </Box>

          {!isForgotPassword && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleButton onClick={handleGoogleSignIn} />
              </div>

              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1, borderColor: '#888', borderWidth: 1 }} />
                <Typography variant="body2" sx={{ mx: 2 }}>
                  Or {isSignIn ? 'sign in' : 'sign up'} with email
                </Typography>
                <Divider sx={{ flexGrow: 1, borderColor: '#888', borderWidth: 1 }} />
              </Box>
            </>
          )}

          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <StyledTextField
                fullWidth
                margin="normal"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  textTransform: 'none', 
                  bgcolor: '#EA2E53', 
                  '&:hover': { 
                    bgcolor: '#D43B1B' 
                  } 
                }}
              >
                Reset Password
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {!isSignIn && (
                <>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LuUserSquare style={{ fontSize: '1.3rem' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              <StyledTextField
                fullWidth
                margin="normal"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={isSignIn ? 12 : 6}>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {!isSignIn && (
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      margin="normal"
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {isSignIn && (
                <Box sx={{ textAlign: 'right', mb: 2 }}>
                  <Button 
                    color="primary" 
                    sx={{ textTransform: 'none', color:'#EA2E53' }}
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  textTransform: 'none', 
                  bgcolor: '#EA2E53', 
                  '&:hover': { 
                    bgcolor: '#D43B1B' 
                  } 
                }}
              >
                {isSignIn ? "Login" : "Sign up"}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {isForgotPassword ? (
              <Button 
                color="primary" 
                onClick={() => setIsForgotPassword(false)}
                sx={{ 
                  textTransform: 'none',
                  color: '#EE4B2B'
                }}
              >
                Back to Sign In
              </Button>
            ) : (
              <Typography variant="body2">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <Button 
                  color="primary" 
                  onClick={toggleMode} 
                  sx={{ 
                    textTransform: 'none',
                    color: '#EE4B2B'
                  }}
                >
                  {isSignIn ? "Create account" : "Sign in"}
                </Button>
              </Typography>
            )}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;