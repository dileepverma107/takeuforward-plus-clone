import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  TextField,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostCard from './PostCard';
import Comment from './Comment';
import { styled } from '@mui/material/styles';

const RichTextArea = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    minHeight: 80,
    maxHeight: 220,
    overflowY: 'auto',
    borderRadius: '10px',
   
  },
  '& .MuiInputBase-input': {
    maxHeight: 220,
    overflowY: 'auto',
    borderRadius: '10px',
  },
}));

const CommentButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  alignSelf: 'flex-end',
  background: '#D41F30',
  color: theme.palette.primary.contrastText,
  marginBottom: '20px',
  '&:hover': {
    background: '#B71A28', // A slightly darker shade for the hover state
  },
}));

const CommentSection = ({ post, userDetails, onAddComment, onAddReply, onBackClick , isDarkMode}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    onAddComment(post.id, newComment);
    setNewComment('');
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: '20px', marginBottom:'50px' }}>
      <Box sx={{ my: 2 }}>
        <Button startIcon={<ArrowBackIcon />} style={{color:isDarkMode? '#fff':'#1E1E1E', border:'1px solid #E0E0E0'}} onClick={onBackClick}>
          Back to Discussion
        </Button>
      </Box>
      <Divider sx={{ my: 2, backgroundColor: 'darkgrey', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }} />
      <PostCard post={post} userDetails={userDetails} />
      <List>
        {post.comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            onAddReply={onAddReply}
            userDetails={userDetails}
          />
        ))}
        <ListItem sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <ListItemAvatar>
            <Avatar src={userDetails?.profileImage || "/path-to-default-avatar.jpg"} />
          </ListItemAvatar>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <RichTextArea
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <CommentButton variant="contained" onClick={handleAddComment}>
              Comment
            </CommentButton>
          </Box>
        </ListItem>
      </List>
    </Container>
  );
};

export default CommentSection;