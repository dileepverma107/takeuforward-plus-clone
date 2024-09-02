import React from 'react';
import { styled } from '@mui/material/styles';
import { Tabs, Tab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

const TestCaseTab = styled(Tab)(({ theme, isDarkMode }) => ({
  minHeight: 30,
  height: 30,
  '& .MuiTab-wrapper': { 
    textTransform: 'none',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  color: isDarkMode ? '#e0e0e0' : '#000', 
  backgroundColor: isDarkMode ? '#333' : '#fff', 
  '&.Mui-selected': {
    color: isDarkMode ? '#fff' : '#000', 
  },
}));

const AddTestCaseTab = styled(Tab)(({ theme, isDarkMode }) => ({
  minWidth: 'auto',
  minHeight: 30,
  height: 30,
  padding: 0,
  color: isDarkMode ? '#e0e0e0' : '#000', 
  backgroundColor: isDarkMode ? '#444' : '#f0f0f0', // Adjusted background colors
  '&:hover': {
    backgroundColor: isDarkMode ? '#555' : '#e0e0e0', // Add hover effect
  },
}));

const TestCaseTabs = ({
  testCases,
  activeTestCase,
  setActiveTestCase,
  handleAddTestCase,
  handleDeleteTestCase,
  isDarkMode
}) => {
  return (
    <Tabs 
      value={activeTestCase} 
      onChange={(e, newValue) => {
        if (newValue === testCases.length) {
          handleAddTestCase();
        } else {
          setActiveTestCase(newValue);
        }
      }} 
      aria-label="testcase tabs" 
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: '36px',
        height: '36px',
        '& .MuiTab-root': {
          minHeight: '36px',
          padding: '6px 12px',
        },
        backgroundColor: isDarkMode ? '#222' : '#f5f5f5', // Add background color to the Tabs container
      }}
    >
      {testCases.map((testCase, index) => (
        <TestCaseTab
          isDarkMode={isDarkMode}
          key={index} 
          label={
            <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#e0e0e0' : '#000', textTransform: 'none', fontSize:'16px' }}>
              {testCase.name}
              {testCase.status && (
                <span style={{ 
                  marginLeft: '8px', 
                  color: testCase.status === 'Accepted' ? '#16A34A' : 'red',
                  fontSize: '0.8rem'
                }}>
                  {testCase.status === 'Accepted' ? <CiCircleCheck style={{ fontSize: '1.3rem', strokeWidth: 1 }} /> : <CiCircleRemove style={{ fontSize: '1.3rem', strokeWidth: 1  }} />}
                </span>
              )}
              {!testCase.isPermanent && (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTestCase(index);
                  }}
                  sx={{ color: isDarkMode ? '#e0e0e0' : '#000' }} // Add color to the close icon
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          } 
        />
      ))}
      <AddTestCaseTab icon={<AddIcon />} isDarkMode={isDarkMode} />
    </Tabs>
  );
};

export default TestCaseTabs;