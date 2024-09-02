import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TagIcon from '@mui/icons-material/Tag';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { auth, db } from "../AuthComponents/Firebase";
import { doc, getDoc } from "firebase/firestore";
import apiClient from '../apiClient';

const ScrollableContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop:'64px',
  width: '100%',
  minHeight: 250,
  maxHeight: 600,
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[400]}`,
}));

const RichTextArea = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    minHeight: 80,
    maxHeight: 220,
    overflowY: 'auto',
  },
  '& .MuiInputBase-input': {
    maxHeight: 220,
    overflowY: 'auto',
  },
}));

const PostCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[400]}`,
}));

const DiscussionForum = () => {
    const [comment, setComment] = useState('');
    const [posts, setPosts] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const cardRef = useRef(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
  
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        console.log(user);
        
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      });
    };
  
    useEffect(() => {
      fetchUserData();
      fetchPosts();
    }, []);
  
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await retrievePosts();
        const formattedPosts = fetchedPosts.map(post => ({
          id: post.id,
          author: post.username,
          avatar: '/path-to-avatar.jpg', // Adjust path as needed
          content: post.content,
          timestamp: new Date(post.date).toLocaleString('en-US', {
            timeZone: 'UTC', 
          }),
          likes: 0,
          comments: post.comments,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    const handleTagClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleTagClose = () => {
      setAnchorEl(null);
    };
  
    const addPost = async (title, comment, username) => {
      try {
        const response = await apiClient.post('http://localhost:5000/api/posts',
          {
            title,
            content: comment,
          },
          {
            params: {
              username,
            },
          }
        );
    
        return response.data;
      } catch (error) {
        console.error('Error adding post:', error);
        throw error;
      }
    };
  
    const retrievePosts = async () => {
      try {
        const response = await apiClient.get('http://localhost:5000/api/posts');
        return response.data;
      } catch (error) {
        console.error('Error retrieving posts:', error);
        throw error;
      }
    };
  
    const handlePublishPost = async () => {
      if (comment.trim()) {
        try {
          console.log(userDetails);
          const postResponse = await addPost('Post Title', comment, userDetails.username);
          console.log(postResponse);
          const newPost = {
            id: postResponse.id,
            author: userDetails.username,
            avatar: '/path-to-avatar.jpg', // Adjust path as needed
            content: postResponse.content,
            timestamp: new Date(postResponse.date).toLocaleString('en-US', {
              timeZone: 'UTC', 
            }), 
            likes: 0,
            comments: [],
          };
  
          setPosts(prevPosts => [newPost, ...prevPosts]);
          setComment('');
        } catch (error) {
          console.error('Failed to publish post:', error);
          // Handle error (e.g., show error message to the user)
        }
      }
    };

    const addComment = async (postId, commentContent, username) => {
        try {
          const response = await apiClient.post(
            `http://localhost:5000/api/posts/comments/${postId}`,
            {
              content: commentContent, 
            },
            {
              params: {
                username,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          return response.data; 
        } catch (error) {
          console.error('Error adding comment:', error);
          throw error; 
        }
      };

      const handleAddComment = async (postId, commentContent) => {
        try {
          const newComment = await addComment(postId, commentContent, userDetails.username); 
          setPosts(posts.map(post => {
            if (post.id === postId) {
              const updatedPost = {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: newComment.id, 
                    author: newComment.user.username, 
                    avatar: '/path-to-current-user-avatar.jpg', 
                    content: newComment.content, 
                    Date: new Date(newComment.date).toLocaleString('en-US', {
                        timeZone: 'UTC', 
                      }),  
                    likes: newComment.likes,
                    replies: newComment.replies,
                  }
                ]
              };
              if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(updatedPost);
              }
              return updatedPost;
            }
            return post;
          }));
      
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
      };

      const addReplyToComment = async (postId, commentId, replyContent, username) => {
        try {
          const response = await apiClient.post(
            `http://localhost:5000/api/posts/comments/${commentId}/reply`,
            {
              content: replyContent,
            },
            {
              params: { username },
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          return response.data;
        } catch (error) {
          console.error('Error adding reply:', error);
          throw error;
        }
      };
      
  
      const handleAddReply = async (postId, commentId, replyContent) => {
        try {
          const username = userDetails.username;
          const replyResponse = await addReplyToComment(postId, commentId, replyContent, username);

        console.log(replyResponse);
          // Update the posts state with the new reply
          setPosts(posts.map(post => {
            if (post.id === postId) {
              const updatedPost = {
                ...post,
                comments: post.comments.map(comment => {
                  if (comment.id === commentId) {
                    return {
                      ...comment,
                      replies: [
                        ...comment.replies,
                        {
                          id: replyResponse.id,
                          author: replyResponse.user.user,
                          avatar: '/path-to-current-user-avatar.jpg', 
                          content: replyResponse.content,
                          timestamp: new Date(replyResponse.timestamp).toLocaleString(),
                          likes: 0,
                        }
                      ]
                    };
                  }
                  return comment;
                })
              };
              if (selectedPost && selectedPost.id === postId) {
                setSelectedPost(updatedPost);
              }
              return updatedPost;
            }
            return post;
          }));
      
        } catch (error) {
          console.error('Failed to add reply:', error);
        }
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
  
    const Comment = ({ comment, postId, depth = 0 }) => {
      const [newReply, setNewReply] = useState('');
      const [showReplyInput, setShowReplyInput] = useState(false);
  
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
                  <Avatar src={comment.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={userDetails.username}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {new Date(comment.date).toLocaleString('en-US', {
                        timeZone: 'UTC', 
                      })}
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
              </Box>
              {showReplyInput && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 7, mr: 2, mb: 2 }}>
                  <Avatar src="/path-to-current-user-avatar.jpg" sx={{ width: 32, height: 32, mr: 1 }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                  <Button onClick={() => {
                    handleAddReply(postId, comment.id, newReply);
                    setNewReply('');
                    setShowReplyInput(false);
                  }}>
                    Reply
                  </Button>
                  <Button onClick={() => setShowReplyInput(false)}>
                    Cancel
                  </Button>
                </Box>
              )}
              {comment.replies && comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
              ))}
            </Box>
          </Box>
          {depth === 0 && <Divider variant="fullWidth" component="li" sx={{ my: 2 }} />}
        </React.Fragment>
      );
    };
  
    const CommentSection = ({ post }) => {
      const [newComment, setNewComment] = useState('');
  
      return (
        <Container maxWidth="md" sx={{marginTop:'64px'}}>
          <Box sx={{ my: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedPost(null)}>
              Back to Posts
            </Button>
          </Box>
          <PostCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={post.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.author}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>
            </CardContent>
          </PostCard>
          <List>
            {post.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} postId={post.id} />
            ))}
            <ListItem>
              <ListItemAvatar>
                <Avatar src="/path-to-current-user-avatar.jpg" />
              </ListItemAvatar>
              <RichTextArea
                fullWidth
                multiline
                maxRows={4}
                variant="outlined"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={() => {
                handleAddComment(post.id, newComment);
                setNewComment('');
              }}>
                Comment
              </Button>
            </ListItem>
          </List>
        </Container>
      );
    };
  
    return (
      <ScrollableContainer>
        {selectedPost ? (
          <CommentSection post={selectedPost} />
        ) : (
          <ContentWrapper>
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
                      src="/path-to-user-avatar.jpg"
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
                <Divider sx={{ my: 2 }} />
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
                    color="primary"
                    onClick={handlePublishPost}
                  >
                    Publish Post
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
  
            {posts.map((post) => (
              <PostCard key={post.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={post.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {userDetails.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(post.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {post.content}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <IconButton size="small">
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" mr={2}>
                        {post.likes}
                      </Typography>
                      <IconButton size="small" onClick={() => setSelectedPost(post)}>
                      <ChatBubbleOutlineIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">
                      {post.comments.length}
                    </Typography>
                  </Box>
                  <Button startIcon={<ShareIcon />} size="small">
                    Share
                  </Button>
                </Box>
              </CardContent>
            </PostCard>
          ))}
        </ContentWrapper>
      )}
    </ScrollableContainer>
  );
};

export default DiscussionForum;