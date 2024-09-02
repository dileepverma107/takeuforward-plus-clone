import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  MenuItem, 
  Avatar, 
  Typography, 
  ListItemIcon, 
  Box,
  IconButton
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { signOut } from 'firebase/auth';
import { auth } from '../AuthComponents/Firebase'; // Adjust the path as needed


const ProfileMenu = ({ anchorEl, open, onClose, userName, onLogout, profileImage }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose(); // Close the menu
      onLogout(); // Call the onLogout function passed from Navbar
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 64,
            height: 64,
            mx: 'auto',
            my: 2,
          },
          width: 225,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ position: 'relative', textAlign: 'center', pb: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Avatar src={profileImage} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Hi, {userName}
        </Typography>
      </Box>
      
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <PersonOutlineIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Profile</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <DescriptionOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Get Certificate</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <BugReportOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Report a Bug</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <GroupAddOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Become an Affiliate</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <MonetizationOnOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Claim Cashback</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <ReceiptOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Download Invoice</Typography>
      </MenuItem>
      <MenuItem sx={{ py: 1.5 }} onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Sign Out</Typography>
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;