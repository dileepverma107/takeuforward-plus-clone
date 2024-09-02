import React, { useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Define the spin animation
const spin = keyframes`
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(540deg);
  }
`;

const SemiCircularWrapper = styled('div')(({ isDarkMode }) => ({
  position: 'relative',
  width: '150px',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: '50%',
  clipPath: 'inset(0 0 0% 0)',
  cursor: 'pointer',
  backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
}));

const ProgressText = styled(Typography)(({ isDarkMode }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: isDarkMode ? '#fff' : '#000',
  fontSize: '16px',
  textAlign: 'center',
}));

const CompletedTextWrapper = styled('div')(({ isDarkMode }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '25%',
  textAlign: 'center',
  background: isDarkMode ? '#1e1e1e' : '#fff',
  zIndex: 3,
}));

const CompletedText = styled(Typography)(({ isDarkMode }) => ({
  fontSize: '12px',
  color: isDarkMode ? '#fff' : '#000',
  padding: '4px 0',
}));

const ProgressIndicator = ({ 
  progress, 
  progressText, 
  progressColor, 
  backgroundColor, 
  submission,
  hoverProgress,
  hoverProgressText,
  hoverSubmission,
  isDarkMode
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentProgress = isHovered ? hoverProgress : progress;
  const currentProgressText = isHovered ? hoverProgressText : progressText;
  const problemText = isHovered ? "Acceptance" : "Solved";
  const currentSubmission = isHovered ? hoverSubmission : submission;

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <SemiCircularWrapper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        isDarkMode={isDarkMode}
      >
        {/* Background CircularProgress */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={150}
          thickness={2}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(180deg)',
            transformOrigin: 'center',
            color: isDarkMode ? '#3a3a3a' : backgroundColor, // Darker background for dark mode
          }}
        />
        {/* Progress CircularProgress */}
        <CircularProgress
          variant="determinate"
          value={currentProgress}
          size={150}
          thickness={2}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: 'center',
            color: progressColor, // Progress color remains the same
            zIndex: 2,
            animation: isHovered ? `${spin} 1s linear` : 'none',
            transform: 'rotate(180deg)',
          }}
        />
        <ProgressText variant="h6" isDarkMode={isDarkMode}>
          {currentProgressText}<br/>
          {problemText}
        </ProgressText>
        <CompletedTextWrapper isDarkMode={isDarkMode}>
          <CompletedText isDarkMode={isDarkMode}>
            {currentSubmission}
          </CompletedText>
        </CompletedTextWrapper>
      </SemiCircularWrapper>
    </Box>
  );
};

export default ProgressIndicator;