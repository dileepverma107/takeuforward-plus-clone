import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TagIcon from '@mui/icons-material/Tag';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  minHeight: 180,
  maxHeight: 600,
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius:'15px',
}));

const RichTextArea = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    minHeight: 50,
    maxHeight: 220,
    overflowY: 'auto',
  },
  '& .MuiInputBase-input': {
    maxHeight: 220,
    overflowY: 'auto',
  },
}));

const CreatePostCard = ({ userDetails, onPublish }) => {
  const [comment, setComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const cardRef = useRef(null);

  const handleTagClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTagClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleResize = () => {
      const cardHeight = cardRef.current ? cardRef.current.clientHeight : 0;
      const textArea = cardRef.current.querySelector('.MuiInputBase-input');
      if (cardHeight >= 600 && textArea) {
        textArea.style.maxHeight = '220px';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [comment]);

  return (
    <StyledCard ref={cardRef}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        py: 3,
      }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={userDetails?.profileImage}
              sx={{ width: 60, height: 60 }}
            />
          </Grid>
          <Grid item xs={11}>
            <RichTextArea
              fullWidth
              multiline
              maxRows={8}
              variant="outlined"
              placeholder="What's on your mind?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <EmojiEmotionsIcon color="primary" />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2, borderColor: 'darkgrey' }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<TagIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={handleTagClick}
          >
            Add question tag
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleTagClose}
          >
            <MenuItem onClick={handleTagClose}>General</MenuItem>
            <MenuItem onClick={handleTagClose}>Technology</MenuItem>
            <MenuItem onClick={handleTagClose}>Science</MenuItem>
          </Menu>
          <Button
  variant="contained"
  style={{ backgroundColor: '#D41F30', color: '#FFFFFF' }} 
  onClick={() => {
    onPublish(comment);
    setComment('');
  }}
>
  Publish Post
</Button>

        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CreatePostCard;