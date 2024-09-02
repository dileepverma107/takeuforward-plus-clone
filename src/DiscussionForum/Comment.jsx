import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Comment = ({ comment, postId, onAddReply, userDetails, depth = 0 }) => {
  const [newReply, setNewReply] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = () => {
    onAddReply(postId, comment.id, newReply);
    setNewReply('');
    setShowReplyInput(false);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', ml: depth * 3 }}>
        {depth > 0 && (
          <Box
            sx={{
              width: 2,
              bgcolor: 'grey.300',
              ml: -2,
              mr: 2,
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={comment.user.profileImage} />
            </ListItemAvatar>
            <ListItemText
              primary={comment.user.name}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="text.primary">
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {comment.date}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 7, mb: 1 }}>
            <IconButton size="small">
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Button
              startIcon={<ReplyIcon />}
              size="small"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </Button>
            {comment.replies && comment.replies.length > 0 && (
              <Button
                startIcon={showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                size="small"
                onClick={toggleReplies}
              >
                {showReplies ? "Hide Replies" : `View ${comment.replies.length} Replies`}
              </Button>
            )}
          </Box>
          {showReplyInput && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 7, mr: 2, mb: 2 }}>
              <Avatar src={userDetails?.profileImage || "/path-to-default-avatar.jpg"} sx={{ width: 32, height: 32, mr: 1 }} />
              <TextField
                fullWidth
                size="small"
                placeholder="Write a reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
              />
              <Button onClick={handleReply}>
                Reply
              </Button>
              <Button onClick={() => setShowReplyInput(false)}>
                Cancel
              </Button>
            </Box>
          )}
          {showReplies && comment.replies && comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              onAddReply={onAddReply}
              userDetails={userDetails}
              depth={depth + 1}
            />
          ))}
        </Box>
      </Box>
      {depth === 0 && <Divider variant="fullWidth" component="li" sx={{ my: 2 }} />}
    </React.Fragment>
  );
};

export default Comment;