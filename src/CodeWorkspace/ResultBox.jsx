import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box, TextField } from '@mui/material';
import { MdMemory } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";

const StyledResultBox = styled(Box)(({ theme, status, isDarkMode }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  color: isDarkMode ? '#E0E0E0' : '#000000',
  border: isDarkMode ? '1px solid #333333' : '1px solid #B0B0B0',
}));

const ResultBox = ({ testCase, handleTestCaseInputChange, activeTestCase, isDarkMode }) => {
  if (!testCase) return null;

  if (testCase.status === 'Error') {
    return (
      <StyledResultBox status={testCase.status} isDarkMode={isDarkMode}>
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontSize: '24px', color: isDarkMode ? '#FF6F61' : '#E11D48', fontWeight: 'bold' }}>
          Compilation Error
        </Typography>
        <Typography variant="body1" component="pre" sx={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#FEF3F2', p: 1, borderRadius: 1, color: isDarkMode ? '#FF6F61' : '#F63E48' }}>
          {testCase.output}
        </Typography>
      </StyledResultBox>
    );
  }

  return testCase.status ? (
    <StyledResultBox status={testCase.status} isDarkMode={isDarkMode}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h5" 
          gutterBottom 
          color={testCase.status === 'Accepted' ? 'success.main' : 'error.main'}
          sx={{ fontWeight: 'bold' }}
        >
          {testCase.status}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}`,
            borderRadius: '8px',
            padding: '4px 8px',
            color: isDarkMode ? '#CCCCCC' : '#B0B0B0',
            marginRight: '8px',
          }}>
            <MdOutlineWatchLater style={{ fontSize: '1.3rem', marginRight: '4px' }} />
            {Math.floor(Math.random() * 100 + 100)}ms
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}`,
            borderRadius: '8px',
            padding: '4px 8px',
            color: isDarkMode ? '#CCCCCC' : '#B0B0B0',
          }}>
            <MdMemory style={{ fontSize: '1.3rem', marginRight: '4px' }} />
            {(Math.random() * 5 + 15).toFixed(2)}MB
          </span>
        </Typography>
      </Box>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Input
      </Typography>
      <Typography variant="body1" component="pre" sx={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#FBFBFB', p: 1, borderRadius: 1, border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}` }}>
        {testCase.input}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Your Output
      </Typography>
      <Typography variant="body1" component="pre" sx={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#FBFBFB', p: 1, borderRadius: 1, border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}` }}>
        {testCase.output}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Expected Output
      </Typography>
      <Typography variant="body1" component="pre" sx={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#FBFBFB', p: 1, borderRadius: 1, border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}` }}>
        {testCase.expectedOutput}
      </Typography>
    </StyledResultBox>
  ) : (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Input
      </Typography>
      {testCase.isPermanent ? (
        <Typography variant="body1" component="pre" sx={{ backgroundColor: isDarkMode ? '#2D2D2D' : '#FBFBFB', p: 1, borderRadius: 1, border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}` }}>
          {testCase.input}
        </Typography>
      ) : (
        <TextField
          multiline
          rows={4}
          value={testCase.input}
          onChange={(e) => handleTestCaseInputChange(activeTestCase, e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: isDarkMode ? '#2D2D2D' : '#FBFBFB',
            borderRadius: 1,
            border: `1px solid ${isDarkMode ? '#666666' : '#B0B0B0'}`,
            color: isDarkMode ? '#E0E0E0' : '#000000',
          }}
        />
      )}
    </>
  );
};

export default ResultBox;
