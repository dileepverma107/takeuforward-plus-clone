import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Grid,
  Box,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled,useTheme } from '@mui/material/styles';
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Input = styled('input')({
  display: 'none',
});

export default function EditProfileComponent() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    college: '',
    github: '',
    linkedin: '',
    twitter: '',
    other: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  

  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData(userData);
          setSelectedImage(userData.profileImage);
          setSkills(userData.skills || []);
        }
      } else {
        setUser(null);
        setProfileData({});
        setSelectedImage(null);
        setSkills([]);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (imageFile && user) {
      try {
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);
        setSelectedImage(downloadURL);
        await setDoc(doc(db, 'users', user.uid), { profileImage: downloadURL }, { merge: true });
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image');
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSavePersonal = async () => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
        toast.success('Personal data saved successfully');
      } catch (error) {
        console.error('Error saving personal data:', error);
        toast.error('Error saving personal data');
      }
    }
  };

  const handleSaveSocial = async () => {
    if (user) {
      const socialData = {};
      ['github', 'linkedin', 'twitter', 'other'].forEach(field => {
        if (profileData[field]) {
          socialData[field] = profileData[field];
        }
      });
      try {
        await setDoc(doc(db, 'users', user.uid), socialData, { merge: true });
        toast.success('Social data saved successfully');
      } catch (error) {
        console.error('Error saving social data:', error);
        toast.error('Error saving social data');
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (user && newPassword === confirmPassword) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        toast.success('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      } catch (error) {
        console.error('Error updating password:', error);
        toast.error('Error updating password');
      }
    } else {
      toast.error('Passwords do not match');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          skills: arrayRemove(skillToRemove)
        });
        setSkills(skills.filter(skill => skill !== skillToRemove));
        toast.success('Skill removed successfully');
      } catch (error) {
        console.error('Error removing skill:', error);
        toast.error('Error removing skill');
      }
    }
  };

  const handleAddSkill = async (event) => {
    if (event.key === 'Enter' && newSkill.trim() !== '') {
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            skills: arrayUnion(newSkill.trim())
          });
          setSkills([...skills, newSkill.trim()]);
          setNewSkill('');
          toast.success('Skill added successfully');
        } catch (error) {
          console.error('Error adding skill:', error);
          toast.error('Error adding skill');
        }
      }
    }
  };

  return (
    <Box sx={{ p: 6, maxWidth: '5xl', mx: 'auto' }}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
        <Button component={Link} to="/"  style={{color: isDarkMode ? '#fff': '#1E1E1E', border:'1px solid #E0E0E0'}} startIcon={<ArrowBackIcon />}>
          Back to Profile
        </Button>
      </Box>
      <Card>
        <CardContent sx={{ p: 6 }}>
          {/* Personal Information Section */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                Personal
              </Typography>
              <Typography color="text.secondary">
                Use a permanent address where you can receive mail.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar 
                  sx={{ width: 100, height: 100, borderRadius:'10px' }} 
                  src={selectedImage || "/placeholder-user.jpg"} 
                  alt="User Avatar"
                >
                  {profileData.name ? profileData.name.charAt(0) : 'U'}
                </Avatar>
                <Box
                  sx={{
                    flexGrow: 1,
                    border: '2px dashed',
                    borderColor: 'text.secondary',
                    p: 0,
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  <label htmlFor="icon-button-file">
                    <Input 
                      accept="image/*" 
                      id="icon-button-file" 
                      type="file" 
                      onChange={handleImageChange}
                    />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <CloudUploadIcon sx={{ width: 24, height: 24, color:'#FF6B6B', mb: 2 }} />
                    </IconButton>
                  </label>
                  <Typography>Click to upload or drag and drop</Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNG, JPG or JPEG (Max. 1mb)
                  </Typography>
                </Box>
                {imageFile && (
                  <Button 
                    variant="contained" 
                    onClick={handleImageUpload}
                    sx={{ bgcolor: '#FF6B6B', color: 'white',width:90, height:90, '&:hover': { bgcolor: '#D41F30' } }}
                  >
                    Upload Image
                  </Button>
                )}
              </Box>
              <Grid container spacing={4} sx={{ mt: 6 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Location" 
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="Your Location" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="College" 
                    name="college"
                    value={profileData.college}
                    onChange={handleInputChange}
                    placeholder="Your College" 
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSavePersonal}
                sx={{ mt: 6, bgcolor: '#ff6b6b', color: 'white', '&:hover': { bgcolor: '#ff5252' } }}
              >
                Save Personal Data
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Social Links Section */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                Social Links
              </Typography>
              <Typography color="text.secondary">
                Your Social Links.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Github" 
                    name="github"
                    value={profileData.github}
                    onChange={handleInputChange}
                    placeholder="Github profile URL" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="LinkedIn" 
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleInputChange}
                    placeholder="LinkedIn profile URL" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Twitter" 
                    name="twitter"
                    value={profileData.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter profile URL" 
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Other" 
                    name="other"
                    value={profileData.other}
                    onChange={handleInputChange}
                    placeholder="Other profile URL" 
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSaveSocial}
                sx={{ mt: 6, bgcolor: '#ff6b6b', color: 'white', '&:hover': { bgcolor: '#ff5252' } }}
              >
                Save Social Data
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Password Section */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                Set Password
              </Typography>
              <Typography color="text.secondary">
                Set your password associated with your account.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleUpdatePassword}
                sx={{ mt: 6, bgcolor: '#ff6b6b', color: 'white', '&:hover': { bgcolor: '#ff5252' } }}
              >
                Update Password
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Skills Section */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                Technical Skills
              </Typography>
              <Typography color="text.secondary">
                Highlighting technical expertise
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ bgcolor: '#ff6b6b', color: 'white' }}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add Skill"
                placeholder="Type a skill and press Enter"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleAddSkill}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}