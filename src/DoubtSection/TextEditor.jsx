import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import apiClient from '../apiClient';
import { db, auth } from '../AuthComponents/Firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc, arrayUnion, arrayRemove, getDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Avatar, Button, IconButton, Typography, TextField, MenuItem, Select, useTheme } from '@mui/material';
import { ContentCopy, Check, ThumbUp, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { FaArrowUp } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { IoShareOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

const botProfileImage = "/bot.png";

const BorderlessSelect = styled(Select)(({ theme }) => ({
  '&': {
    border: `1px solid ${theme.palette.mode === 'dark' ? '#666666' : '#cccccc'}`,
    borderRadius: '4px',
    outline: 'none',
    height: '40px',
    '&:hover': {
      border: `1px solid ${theme.palette.mode === 'dark' ? '#666666' : '#cccccc'}`,
      outline: 'none',
    },
    '&.Mui-focused': {
      border: `1px solid ${theme.palette.mode === 'dark' ? '#666666' : '#cccccc'}`,
      outline: 'none',
    },
  },
  '& .MuiSelect-select': {
    paddingRight: '24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  '& .MuiSelect-icon': {
    top: 'calc(50% - 12px)',
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-select': {
    padding: '0 12px',
  },
}));

const TextEditor = ({titleSlug}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [forums, setForums] = useState([]);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [expandedDoubt, setExpandedDoubt] = useState(null);
  const [expandedForum, setExpandedForum] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('likes');
  const [userData, setUserData] = useState(null);

  const getUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'Users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchedUserData = await getUserData(currentUser.uid);
        setUserData(fetchedUserData);
        console.log(fetchedUserData);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setProfileImage(doc.data().profileImage);
          }
        });
        return () => {
          unsubscribeUser();
        };
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const doubtsQuery = query(
      collection(db, 'doubts'),
      where('titleSlug', '==', titleSlug),
      orderBy('createdAt', 'desc')
    );
    const forumsQuery = query(
      collection(db, 'forums'),
      where('titleSlug', '==', titleSlug),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeDoubts = onSnapshot(doubtsQuery, (snapshot) => {
      setDoubts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeForums = onSnapshot(forumsQuery, (snapshot) => {
      setForums(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeDoubts();
      unsubscribeForums();
    };
  }, [titleSlug]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
    ],
  };

  const formats = [
    'bold', 'italic', 'underline',
    'blockquote', 'code-block',
  ];

  const handleTextChange = (content) => {
    setText(content);
  };

  const cleanContent = (content) => {
    let cleanedContent = content.replace(/<[^>]*>/g, '');
    cleanedContent = cleanedContent.replace(/&nbsp;/g, ' ');
    cleanedContent = cleanedContent.replace(/<\|im_start\|>user|<\|im_end\|>/g, '');
    cleanedContent = [...new Set(cleanedContent.split('\n'))].join('\n').trim();
    return cleanedContent;
  };

  const handlePostDoubt = useCallback(async () => {
    if (!user) {
      alert('You must be logged in to post a doubt.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanedText = cleanContent(text);
      const response = await apiClient.post('http://localhost:5000/ai-completion', {
        content: cleanedText
      });

      const newDoubt = {
        content: cleanedText,
        response: response.data.content,
        responseTime: new Date().toISOString(),
        userId: user.uid,
        username: userData.username || 'Anonymous',
        userPhotoURL: profileImage || 'https://via.placeholder.com/40',
        createdAt: new Date().toISOString(),
        likes: [],
        titleSlug: titleSlug,
      };

      await addDoc(collection(db, 'doubts'), newDoubt);
      setText('');
    } catch (error) {
      console.error('Error posting doubt:', error);
      alert("An error occurred while posting your doubt.");
    } finally {
      setIsLoading(false);
    }
  }, [text, user, profileImage, titleSlug, userData]);

  const handlePostForum = useCallback(async () => {
    if (!user) {
      alert('You must be logged in to post a forum.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanedText = cleanContent(text);

      const newForum = {
        content: cleanedText,
        userId: user.uid,
        username: userData.username || 'Anonymous',
        userPhotoURL: profileImage || 'https://via.placeholder.com/40',
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        titleSlug: titleSlug,
      };

      await addDoc(collection(db, 'forums'), newForum);
      setText('');
    } catch (error) {
      console.error('Error posting forum:', error);
      alert("An error occurred while posting your forum.");
    } finally {
      setIsLoading(false);
    }
  }, [text, user, profileImage, titleSlug, userData]);

  const handleDeleteDoubt = async (id) => {
    if (!user) {
      alert('You must be logged in to delete a doubt.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'doubts', id));
    } catch (error) {
      console.error('Error deleting doubt:', error);
      alert("An error occurred while deleting the doubt.");
    }
  };

  const handleDeleteForum = async (id) => {
    if (!user) {
      alert('You must be logged in to delete a forum.');
      return;
    }

    try {
      await deleteDoc(doc(db, 'forums', id));
    } catch (error) {
      console.error('Error deleting forum:', error);
      alert("An error occurred while deleting the forum.");
    }
  };

  const handleLike = async (collectionName, itemId) => {
    if (!user) {
      alert('You must be logged in to like a post.');
      return;
    }
  
    const itemRef = doc(db, collectionName, itemId);
    const item = collectionName === 'doubts' 
      ? doubts.find(d => d.id === itemId)
      : forums.find(f => f.id === itemId);
    
    const likes = Array.isArray(item.likes) ? item.likes : [];
  
    if (likes.includes(user.uid)) {
      await updateDoc(itemRef, {
        likes: arrayRemove(user.uid)
      });
    } else {
      await updateDoc(itemRef, {
        likes: arrayUnion(user.uid)
      });
    }
  };

  const toggleExpand = (itemId, type) => {
    if (type === 'doubt') {
      setExpandedDoubt(expandedDoubt === itemId ? null : itemId);
    } else {
      setExpandedForum(expandedForum === itemId ? null : itemId);
    }
  };

  const handleCopy = (codeId, code) => {
    navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [codeId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [codeId]: false }));
    }, 2000);
  };

  const renderContent = (content) => {
    const codeRegex = /```[\s\S]*?```/g;
    const parts = content.split(codeRegex);
    const codes = content.match(codeRegex);

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br>') }} />
        {codes && codes[index] && (
          <div className="code-block" style={{ position: 'relative', marginBottom: '1em' }}>
            <SyntaxHighlighter 
              language="javascript" 
              style={isDarkMode ? vscDarkPlus : vs}
              customStyle={{ paddingTop: '2.5em' }}
            >
              {codes[index].replace(/```/g, '')}
            </SyntaxHighlighter>
            <IconButton
              size="small"
              onClick={() => handleCopy(`code-${index}`, codes[index].replace(/```/g, ''))}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                color: isDarkMode ? 'white' : 'black',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {copiedStates[`code-${index}`] ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </div>
        )}
      </React.Fragment>
    ));
  };

  const handleAddComment = async (forumId) => {
    if (!user) {
      alert('You must be logged in to add a comment.');
      return;
    }

    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const forumRef = doc(db, 'forums', forumId);
      await updateDoc(forumRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          userId: user.uid,
          username: userData.username || 'Anonymous',
          userPhotoURL: profileImage || 'https://via.placeholder.com/40',
          content: newComment,
          createdAt: new Date().toISOString(),
          likes: [],
        })
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert("An error occurred while adding your comment.");
    }
  };

  const handleLikeComment = async (forumId, commentId) => {
    if (!user) {
      alert('You must be logged in to like a comment.');
      return;
    }

    try {
      const forumRef = doc(db, 'forums', forumId);
      const forumDoc = await getDoc(forumRef);
      const forumData = forumDoc.data();
      const updatedComments = forumData.comments.map(comment => {
        if (comment.id === commentId) {
          const likes = comment.likes || [];
          if (likes.includes(user.uid)) {
            return { ...comment, likes: likes.filter(id => id !== user.uid) };
          } else {
            return { ...comment, likes: [...likes, user.uid] };
          }
        }
        return comment;
      });
      await updateDoc(forumRef, { comments: updatedComments });
    } catch (error) {
      console.error('Error liking comment:', error);
      alert("An error occurred while liking the comment.");
    }
  };

  const handleDeleteComment = async (forumId, commentId) => {
    if (!user) {
      alert('You must be logged in to delete a comment.');
      return;
    }

    try {
      const forumRef = doc(db, 'forums', forumId);
      const forumDoc = await getDoc(forumRef);
      
      const forumData = forumDoc.data();
      const updatedComments = forumData.comments.filter(comment => comment.id !== commentId);
      await updateDoc(forumRef, { comments: updatedComments });
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert("An error occurred while deleting the comment.");
    }
  };

  const renderComments = (comments, forumId) => {
    return comments.map((comment) => (
      <div key={comment.id} style={{ margin: '10px 0', backgroundColor: isDarkMode ? '#2c2c2c' : '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={comment.userPhotoURL} alt={comment.username} />
            <div style={{ marginLeft: '10px' }}>
              <Typography variant="subtitle2" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>{comment.username}</Typography>
              <Typography variant="caption" style={{color: isDarkMode ? '#cccccc' : '#666666'}}>{new Date(comment.createdAt).toLocaleString()}</Typography>
            </div>
          </div>
          <div>
            <IconButton onClick={() => handleLikeComment(forumId, comment.id)} color={comment.likes?.includes(user?.uid) ? "primary" : "default"}>
              <FaArrowUp style={{ fontSize: '1.3rem'}}/>
            </IconButton>
            <Typography variant="caption" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>{comment.likes?.length || 0}</Typography>
            {user && user.uid === comment.userId && (
              <IconButton onClick={() => handleDeleteComment(forumId, comment.id)}>
                <RiDeleteBin6Line style={{ fontSize: '1.3rem', color: isDarkMode ? '#ffffff' : '#000000'}}/>
              </IconButton>
            )}
          </div>
        </div>
        <Typography variant="body2" style={{ marginTop: '5px', color: isDarkMode ? '#ffffff' : '#000000' }}>{comment.content}</Typography>
      </div>
    ));
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedDoubts = [...doubts].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes.length - a.likes.length;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const sortedForums = [...forums].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes.length - a.likes.length;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="text-editor-container" style={{ backgroundColor: isDarkMode ? '#121212' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
      <div className={`quill-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <ReactQuill
          theme="snow"
          value={text}
          onChange={handleTextChange}
          modules={modules}
          formats={formats}
          className="quill"
          placeholder="Type your doubt or forum post here..."
        />
      </div>
      <div className="bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5', padding: '10px' }}>
        <div>
          <BorderlessSelect
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy}
            onChange={handleSortChange}
            style={{ marginRight: '10px' }}
            disableUnderline
          >
            <MenuItem value="likes">Likes</MenuItem>
            <MenuItem value="time">Time</MenuItem>
          </BorderlessSelect>
        </div>
        <div>
          <Button 
            variant="contained" 
            onClick={handlePostDoubt} 
            disabled={isLoading}
            style={{ 
              backgroundColor: isDarkMode ? '#D41F30' : '#D41F30', 
              color: '#fff', 
              marginRight: '10px',
              textTransform:'none' 
            }}
          >
            Post Doubt
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePostForum} 
            disabled={isLoading}
            style={{ 
              backgroundColor: isDarkMode ? '#D41F30' : '#D41F30', 
              color: '#fff',
              textTransform:'none'  
            }}
          >
            Post Forum
          </Button>
        </div>
      </div>
      <div className="doubts-and-forums-list">
        {[...sortedDoubts, ...sortedForums].map((item) => (
          <div key={item.id} className={item.response ? "doubt-item" : "forum-item"} style={{ marginBottom: '20px', backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={item.userPhotoURL} alt={item.username} />
                <div style={{ marginLeft: '10px' }}>
                  <Typography variant="subtitle1" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>{item.username}</Typography>
                  <Typography variant="caption" style={{color: isDarkMode ? '#cccccc' : '#666666'}}>{new Date(item.createdAt).toLocaleString()}</Typography>
                </div>
              </div>
              {user && user.uid === item.userId && (
                <IconButton onClick={() => item.response ? handleDeleteDoubt(item.id) : handleDeleteForum(item.id)}>
                  <RiDeleteBin6Line style={{ fontSize: '1.3rem', color: isDarkMode ? '#ffffff' : '#000000'}}/>
                </IconButton>
              )}
            </div>
            <Typography variant="body1" style={{ margin: '10px 0', color: isDarkMode ? '#ffffff' : '#000000' }}>{item.content}</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => handleLike(item.response ? 'doubts' : 'forums', item.id)} 
                color={item.likes.includes(user?.uid) ? "primary" : "default"}
                disabled={!user}
              >
                <FaArrowUp style={{ fontSize: '1.3rem'}}/>
              </IconButton>
              <Typography variant="body2" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>{item.likes.length}</Typography>
              <IconButton onClick={() => toggleExpand(item.id, item.response ? 'doubt' : 'forum')}>
                <GoCommentDiscussion style={{ fontSize: '1.3rem', color: isDarkMode ? '#ffffff' : '#000000'}}/>
              </IconButton>
              <Typography variant="body2" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>
                {item.response ? (item.response ? 1 : 0) : item.comments.length} 
              </Typography>
              <Typography variant="body2" style={{marginLeft:'5px', color: isDarkMode ? '#ffffff' : '#000000'}}> replies </Typography>              
              <IconButton>
                <IoShareOutline style={{ fontSize: '1.3rem', color: isDarkMode ? '#ffffff' : '#000000'}}/>
              </IconButton>
              <Typography variant="body2" style={{marginLeft:'5px', color: isDarkMode ? '#ffffff' : '#000000'}}> Share </Typography>
            </div>
            {((expandedDoubt === item.id && item.response) || (expandedForum === item.id)) && (
              <div style={{ marginTop: '10px', backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', padding: '15px', borderRadius: '8px' }}>
                {item.response ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <Avatar 
                        src={botProfileImage} 
                        alt="Chatbot" 
                        sx={{ width: 55, height: 55 }}
                      />
                      <div style={{ marginLeft: '10px' }}>
                        <Typography variant="subtitle2" style={{color: isDarkMode ? '#ffffff' : '#000000'}}>Chatbot AI Assistant</Typography>
                        <Typography variant="caption" style={{color: isDarkMode ? '#cccccc' : '#666666'}}>{new Date(item.responseTime).toLocaleString()}</Typography>
                      </div>
                    </div>
                    {renderContent(item.response)}
                  </>
                ) : (
                  <>
                    {renderComments(item.comments, item.id)}
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ marginTop: '10px' }}
                      InputProps={{
                        style: {
                          color: isDarkMode ? '#ffffff' : '#000000',
                          backgroundColor: isDarkMode ? '#333333' : '#ffffff',
                        }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleAddComment(item.id)}
                      style={{ marginTop: '10px', backgroundColor: isDarkMode ? '#1e88e5' : '#D41F30' }}
                    >
                      Add Comment
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextEditor;