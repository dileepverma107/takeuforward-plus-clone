import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { MdClose } from "react-icons/md";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { vscodeDark, githubLight } from '@uiw/codemirror-themes-all';

const formatAnalysisText = (text, isDarkMode) => {
  text = text.replace(/Time Complexity:/g, '\nTime Complexity:');
  text = text.replace(/Space Complexity:/g, '\nSpace Complexity:');
  const lines = text.split('\n');

  return lines.map((line, index) => {
    if (line.includes("Time Complexity:")) {
      return (
        <Typography key={index} component="div">
          <strong>Time Complexity: </strong>
          <span style={{ color: isDarkMode ? '#FF6B6B' : '#D32F2F' }}>{line.split("Time Complexity: ")[1]}</span>
        </Typography>
      );
    } else if (line.includes("Space Complexity:")) {
      return (
        <Typography key={index} component="div">
          <strong>Space Complexity: </strong>
          <span style={{ color: isDarkMode ? '#FF6B6B' : '#D32F2F' }}>{line.split("Space Complexity: ")[1]}</span>
        </Typography>
      );
    } else {
      return (
        <Typography key={index} component="div" paragraph>
          {line}
        </Typography>
      );
    }
  });
};

const AnalysisModal = ({ open, onClose, isAnalyzing, analysisResult, languageSubmission, analysisFlag }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const getLanguageMode = (language) => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'python':
        return python();
      case 'cpp':
        return cpp();
      case 'java':
        return java();
      default:
        return null;
    }
  };

  const languageMode = getLanguageMode(languageSubmission);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="analysis-modal-title"
      aria-describedby="analysis-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 1000,
          bgcolor: isDarkMode ? '#1E1E1E' : 'background.paper',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            bgcolor: isDarkMode ? '#1E1E1E' : '#ECEFF7',
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
            p: 2,
          }}
        >
          <Typography id="analysis-modal-title" variant="h6" component="h2" color={isDarkMode ? 'white' : 'inherit'}>
            {analysisFlag === 'view' ? 'Review' : 'Code Analysis'}
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 4,
            bgcolor: isDarkMode ? '#1E1E1E' : 'inherit',
          }}
        >
          {isAnalyzing ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <CircularProgress color={isDarkMode ? 'secondary' : 'primary'} />
            </Box>
          ) : analysisResult ? (
            <Box
              sx={{
                '& .cm-editor': {
                  height: '100%',
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }
              }}
            >
              {analysisFlag === 'view' ? (
                <Box
                sx={{
                  p: 2,
                  height: '400px',
                  overflow: 'hidden', // Hide the scrollbars on the container
                  '& .cm-scroller': {
                    overflow: 'scroll', // Enable scrolling within CodeMirror
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': {
                      display: 'none' // For WebKit browsers
                    }
                  }
                }}
              >
                <CodeMirror
                  value={analysisResult.content}
                  extensions={[languageMode]}
                  theme={isDarkMode ? vscodeDark : githubLight}
                  readOnly
                  style={{ height: '100%' }}
                  options={{
                    lineWrapping: true,
                  }}
                />
                </Box>
              ) : (
                <Typography color={isDarkMode ? 'white' : 'inherit'}>
                  {formatAnalysisText(analysisResult.content.replaceAll('**',''), isDarkMode)}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography color="error">Failed to analyze code</Typography>
          )}
        </Box>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
          bgcolor: isDarkMode ? '#1E1E1E' : '#ECEFF7',
        }}>
          <IconButton onClick={onClose} color={isDarkMode ? '#ffffff' : 'primary'}>
            <MdClose />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AnalysisModal;