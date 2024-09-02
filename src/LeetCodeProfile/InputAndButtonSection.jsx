import React, { useState } from 'react';
import { Box, TextField, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const InputAndButtonSection = ({ onSearch }) => {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    if (username.trim()) {
      onSearch(username);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop={2}>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <TextField
          placeholder="Enter username"
          variant="standard"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              borderBottom: '2px solid #1976d2',
              borderRadius: '4px',
              paddingRight: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
              },
              '& .MuiInputBase-input': {
                padding: '10px 12px',
                borderRadius: '4px',
              },
            },
            '& .MuiInputBase-input:focus': {
              outline: 'none',
            }
          }}
        />
        <IconButton
          color="primary"
          sx={{
            marginLeft: 1,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
              backgroundColor: '#e3f2fd',
            }
          }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputAndButtonSection;
