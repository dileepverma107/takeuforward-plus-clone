import React from 'react';
import { Card, CardContent, CardActions, Avatar, Typography, Box, IconButton } from '@mui/material';
import { LinkedIn, Twitter, Instagram, YouTube, Close } from '@mui/icons-material';

export type Person = 'Raj' | 'Dileep';
const rajProfile = "/raj.jpeg";
const dileepProfile = "/me.jpg";

interface ProfileCardProps {
  person: Person;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ person, onClose }) => {
  const profiles = {
    Raj: {
      name: "Striver",
      username: "striver_79",
      rank: "SWE-III @ Google | Building - takeUforward | 600K+ on YT",
      profilePic: rajProfile,
      linkedin: "https://www.linkedin.com/in/rajstriver/",
      twitter: "https://x.com/striver_79",
      instagram: "https://www.instagram.com/striver_79/",
      youTube: "https://www.youtube.com/@takeUforward"
    },
    Dileep: {
      name: "Dileep Verma",
      username: "dileepverma107",
      rank: "CS-I @Adobe(temp) | Sr. Software Eng. @PwC",
      profilePic: dileepProfile,
      linkedin: "https://www.linkedin.com/in/dileep-verma-35a319139/",
      twitter: "https://x.com/nextgensolver",
      instagram: "https://www.instagram.com/dileepverma107/",
      youTube: ""
    }
  };

  const profile = profiles[person];

  return (
    <Card sx={{ width: 350, maxWidth: '100%', bgcolor: '#1e1e1e', color: 'white' }}>
      <CardContent sx={{ display: 'flex', padding: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profile.profilePic}
              alt={`${profile.name}'s Profile Picture`}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" component="div">
                {profile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                @{profile.username}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
            {profile.rank}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <LinkedIn sx={{ color: '#0077B5', mb: 1 }} />
          </a>
          <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Twitter sx={{ color: '#1DA1F2', mb: 1 }} />
          </a>
          <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Instagram sx={{ color: '#E4405F', mb: 1 }} />
          </a>
          <a href={profile.youTube} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <YouTube sx={{ color: '#FF0000' }} />
          </a>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;