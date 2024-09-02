// ProfileStats.js
import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Box, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const Container = styled(Box)(({ theme,isDarkMode }) => ({
  display: 'flex',
  backgroundColor:isDarkMode ? '#1E1E1E': theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const ProfileSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const StatsSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const CircularProgressBar = styled(Box)(({ theme, value, color }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: `conic-gradient(
    ${color} ${value}%,
    ${theme.palette.grey[200]} ${value}% 100%
  )`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '10px',
    borderRadius: '50%',
    background: theme.palette.background.paper,
  },
}));

const ProgressContent = styled(Box)({
  zIndex: 1,
  position: 'relative',
  textAlign: 'center',
});

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

function ProfileStats({questions, isDarkMode}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userName, setuserName] = useState('Anonymous');
 

  useEffect(() => {
    const total = questions.reduce((sum, question) => sum + (question.points || 0), 0);
    setCurrentPoints(total);
    setTotalPoints(questions.length * 100);
  }, [questions]);

  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfileImage(userDoc.data().profileImage);
          setuserName(userDoc.data().name);
        }
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleImageUpload = async (event) => {
    if (!user) return;

    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, 'users', user.uid), { profileImage: downloadURL }, { merge: true });
      setProfileImage(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const calculateProgressPercentage = (current, total) => {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <Grid container>
        <ProfileSection item xs={6}>
          <Avatar
            alt={userName || "Anonymous"}
            src={profileImage || "/path-to-default-image.jpg"}
            sx={{ width: 150, height: 150 }}
          />
          <Box textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <Typography variant="h5">{userName || 'Unknown User'}</Typography>
              <IconButton onClick={handleEditClick} >
                <EditIcon fontSize="small" color="primary"  style={{color: isDarkMode ? '#D41F30':'black'}}/>
              </IconButton>
            </Box>
            {uploading && <Typography variant="body2">Uploading...</Typography>}
          </Box>
        </ProfileSection>
        <StatsSection item xs={6}>
          <StatItem>
            <CircularProgressBar value={0} color="red">
              <ProgressContent>
                <Typography variant="body2" color="text.secondary">
                  coming <br/> soon
                </Typography>
              </ProgressContent>
            </CircularProgressBar>
            <Typography variant="body1">Contest</Typography>
          </StatItem>
          <StatItem>
            <CircularProgressBar value={calculateProgressPercentage(currentPoints, totalPoints)} color="red">
              <ProgressContent>
                <Typography variant="h6">{currentPoints}</Typography> 
                <Typography variant="body2">{totalPoints}</Typography>
              </ProgressContent>
            </CircularProgressBar>
            <Typography variant="body1">Problem Solving</Typography>
          </StatItem>
          <StatItem>
            <CircularProgressBar value={calculateProgressPercentage(0, 3650)} color="red">
              <ProgressContent>
                {/*<Typography variant="h6">Feature</Typography>*/}
                <Typography variant="body2" color="text.secondary"> Feature <br/> Not <br/> Awailable</Typography>
              </ProgressContent>
            </CircularProgressBar>
            <Typography variant="body1">Example Guessing</Typography>
          </StatItem>
        </StatsSection>
      </Grid>
    </Container>
  );
}

export default ProfileStats;