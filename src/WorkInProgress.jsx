import React from 'react';

const IconscoutAnimation = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <video
        width="80%" // Decrease width to 80% of the container
        height="auto" // Maintain aspect ratio
        autoPlay
        loop
        muted
        playsInline
        style={{ maxWidth: '1500px', maxHeight: '840px' }} // Maximum dimensions
      >
        <source src="/workinprogress.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>In Progress</p>
    </div>
  );
};

export default IconscoutAnimation;
