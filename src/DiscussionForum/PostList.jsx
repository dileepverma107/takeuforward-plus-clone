import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts, userDetails, onSelectPost }) => {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userDetails={userDetails}
          onSelectPost={onSelectPost}
        />
      ))}
    </>
  );
};

export default PostList;