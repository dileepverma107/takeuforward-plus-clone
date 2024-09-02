import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import TestCaseTabs from './TestCaseTabs';
import ResultBox from './ResultBox';

const IOWrapper = styled(Box)(({ theme,isDarkMode }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
  color: isDarkMode ? theme.palette.text.primary : theme.palette.text.secondary,
}));

const IOPane = ({ testCases, setTestCases, activeTestCase, setActiveTestCase,isDarkMode }) => {
  const handleAddTestCase = () => {
    const newTestCase = {
      name: `Testcase ${testCases.length + 1}`,
      input: '',
      expectedOutput: '',
      isPermanent: false,
      status: null
    };
    setTestCases([...testCases, newTestCase]);
    setActiveTestCase(testCases.length);
  };

  const handleDeleteTestCase = (index) => {
    const updatedTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(updatedTestCases);
    if (activeTestCase >= updatedTestCases.length) {
      setActiveTestCase(updatedTestCases.length - 1);
    }
  };

  const handleTestCaseInputChange = (index, newInput) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index].input = newInput;
    setTestCases(updatedTestCases);
  };

  return (
    <IOWrapper isDarkMode={isDarkMode}>
      <TestCaseTabs
        testCases={testCases}
        activeTestCase={activeTestCase}
        setActiveTestCase={setActiveTestCase}
        handleAddTestCase={handleAddTestCase}
        handleDeleteTestCase={handleDeleteTestCase}
        isDarkMode={isDarkMode}
      />
      <Box sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          backgroundColor: isDarkMode ? '#121212' : '#fff', // Background for the content area
          color: isDarkMode ? '#e0e0e0' : '#000', // Text color
        }}>
        <ResultBox
          testCase={testCases[activeTestCase]}
          handleTestCaseInputChange={handleTestCaseInputChange}
          activeTestCase={activeTestCase}
          isDarkMode={isDarkMode}
        />
      </Box>
    </IOWrapper>
  );
};

export default IOPane;