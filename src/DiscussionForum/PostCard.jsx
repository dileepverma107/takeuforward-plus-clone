import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  overflow: 'visible',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[400]}`,
  borderRadius:'15px',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
  '&:last-child': {
    paddingBottom: theme.spacing(1.5),
  },
}));

const PostCard = ({ post, userDetails, onSelectPost }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar src={post.user.profileImage} sx={{ width: 32, height: 32, mr: 1 }} />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {post.user.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(post.date).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
          {post.content}
        </Typography>
        <Divider sx={{ my: 1, borderColor: 'darkgrey' }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <IconButton size="small">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" mr={1}>
              {post.likes}
            </Typography>
            <IconButton size="small" onClick={() => onSelectPost(post)}>
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">
              {post.comments.length}
            </Typography>
          </Box>
          <Button startIcon={<ShareIcon />} size="small">
            Share
          </Button>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default PostCard;