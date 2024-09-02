import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { auth, db } from "../AuthComponents/Firebase";
import { doc, getDoc, collection, addDoc, updateDoc, arrayUnion, query, orderBy, serverTimestamp, onSnapshot, Timestamp, runTransaction } from "firebase/firestore";
import CreatePostCard from './CreatePostCard';
import PostList from './PostList';
import CommentSection from './CommentSection';

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

const formatFirestoreTimestamp = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  return 'Invalid date';
};

const DiscussionForum = ({isDarkMode}) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in");
        setUserDetails(null);
      }
    });

    const unsubscribePosts = setupPostsListener();

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);


  const setupPostsListener = () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: formatDate(data.date),
          comments: formatComments(data.comments || [])
        };
      });

      setPosts(fetchedPosts);

      if (selectedPost) {
        const updatedSelectedPost = fetchedPosts.find(post => post.id === selectedPost.id);
        if (updatedSelectedPost) {
          setSelectedPost(updatedSelectedPost);
        }
      }
    });
  };

  const formatDate = (date) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleString('en-US', { timeZone: 'UTC' });
    }
    return new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  };

  const formatComments = (comments) => {
    return comments.map(comment => ({
      ...comment,
      date: formatDate(comment.date),
      replies: formatComments(comment.replies || [])
    }));
  };

  const addPost = async (title, content) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
  
      let userData = {
        name: user.displayName || "Anonymous",
        profileImage: user.photoURL || "default_profile_image_url"
      };
  
      // Fetch additional user data from Firestore if needed
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const firestoreUserData = userSnap.data();
          userData.name = firestoreUserData.name || userData.name;
          userData.profileImage = firestoreUserData.profileImage || userData.profileImage;
        }
      } catch (error) {
        console.warn("Couldn't fetch user data from Firestore, using default values", error);
      }
  
      const newPost = {
        title,
        content,
        user: {
          id: user.uid,
          name: userData.name,
          profileImage: userData.profileImage,
        },
        date: serverTimestamp(),
        comments: [],
      };
  
      const docRef = await addDoc(collection(db, "posts"), newPost);
      return { id: docRef.id, ...newPost };
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  };


  const handlePublishPost = async (comment) => {
    if (comment.trim()) {
      try {
        await addPost('Post Title', comment);
      } catch (error) {
        console.error('Failed to publish post:', error);
      }
    }
  };

  const addComment = async (postId, commentContent) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      let userData = {
        name: "Anonymous",
        profileImage: "default_profile_image_url"
      };

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const firestoreUserData = userSnap.data();
          userData.name = firestoreUserData.name || userData.name;
          userData.profileImage = firestoreUserData.profileImage || userData.profileImage;
        }
      } catch (error) {
        console.warn("Couldn't fetch user data from Firestore, using default values", error);
      }

      const newComment = {
        id: Date.now().toString(),
        content: commentContent,
        user: {
          id: user.uid,
          name: userData.name,
          profileImage: userData.profileImage,
        },
        date: Timestamp.now(),
        likes: 0,
        replies: [],
      };

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    try {
      const newComment = await addComment(postId, commentContent);
      const formattedComment = {
        ...newComment,
        date: formatFirestoreTimestamp(newComment.date)
      };
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, formattedComment] }
            : post
        )
      );
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prevPost => ({
          ...prevPost,
          comments: [...prevPost.comments, formattedComment]
        }));
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const addReplyToComment = async (postId, commentId, replyContent) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      let userData = {
        name: "Anonymous",
        profileImage: "default_profile_image_url"
      };

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const firestoreUserData = userSnap.data();
          userData.name = firestoreUserData.name || userData.name;
          userData.profileImage = firestoreUserData.profileImage || userData.profileImage;
        }
      } catch (error) {
        console.warn("Couldn't fetch user data from Firestore, using default values", error);
      }

      const newReply = {
        id: Date.now().toString(),
        content: replyContent,
        user: {
          id: user.uid,
          name: userData.name,
          profileImage: userData.profileImage,
        },
        date: Timestamp.now(),
        likes: 0,
        replies: [],
      };

      const postRef = doc(db, "posts", postId);

      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw new Error("Post does not exist!");
        }

        const postData = postDoc.data();
        const updatedComments = updateCommentsWithReply(postData.comments, commentId, newReply);

        transaction.update(postRef, { comments: updatedComments });
      });

      return newReply;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  const updateCommentsWithReply = (comments, commentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies, commentId, newReply)
        };
      }
      return comment;
    });
  };

  const handleAddReply = async (postId, commentId, replyContent) => {
    try {
      const newReply = await addReplyToComment(postId, commentId, replyContent);
      const formattedReply = {
        ...newReply,
        date: formatFirestoreTimestamp(newReply.date)
      };
      const updateCommentsWithFormattedReply = (comments, targetCommentId, formattedReply) => {
        return comments.map(comment => {
          if (comment.id === targetCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), formattedReply]
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentsWithFormattedReply(comment.replies, targetCommentId, formattedReply)
            };
          }
          return comment;
        });
      };
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? {
                ...post,
                comments: updateCommentsWithFormattedReply(post.comments, commentId, formattedReply)
              }
            : post
        )
      );
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prevPost => ({
          ...prevPost,
          comments: updateCommentsWithFormattedReply(prevPost.comments, commentId, formattedReply)
        }));
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  return (
    <ScrollableContainer>
      {selectedPost ? (
        <CommentSection
          post={selectedPost}
          userDetails={userDetails}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
          onBackClick={() => setSelectedPost(null)}
          isDarkMode={isDarkMode}
        />
      ) : (
        <ContentWrapper>
          <CreatePostCard userDetails={userDetails} onPublish={handlePublishPost} />
          <PostList
            posts={posts}
            userDetails={userDetails}
            onSelectPost={setSelectedPost}
          />
        </ContentWrapper>
      )}
    </ScrollableContainer>
  );
};

export default DiscussionForum;