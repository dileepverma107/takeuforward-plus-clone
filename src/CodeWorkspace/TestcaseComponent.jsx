import React, { useState } from 'react';
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  content: {
    width: 400,
    backgroundColor: 'white',
    borderRadius: 8,
    border: '1px solid #ccc',
    padding: 24,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputField: {
    flexGrow: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 8,
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
}));

const TestcaseComponent = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [testcase1, setTestcase1] = useState('');
  const [testcase2, setTestcase2] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = () => {
    const nums = inputValue.split(',').map(Number);
    setTestcase1(`Testcase 1: [${nums}]`);
    setTestcase2(`Testcase 2: [${nums}]`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        <Box className={classes.content}>
          <Typography variant="h5" gutterBottom>
            Testcase
          </Typography>
          <Box className={classes.inputContainer}>
            <TextField
              variant="outlined"
              placeholder="Enter numbers (e.g., 2, 3, 7, 1, 3, 5)"
              value={inputValue}
              onChange={handleInputChange}
              fullWidth
              className={classes.inputField}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddClick}
              className={classes.addButton}
            >
              +
            </Button>
          </Box>
          <Typography>{testcase1}</Typography>
          <Typography>{testcase2}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TestcaseComponent;