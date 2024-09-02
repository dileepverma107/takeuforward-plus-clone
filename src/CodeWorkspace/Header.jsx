import React from 'react';
import { styled , useTheme} from '@mui/material/styles';
import {
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IoPlay } from "react-icons/io5";
import { LuUpload } from "react-icons/lu";

const HeaderWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledButton = styled('button')(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode ? '#121212':'#FFFFFF',
  color:isDarkMode ? '#fff':'#000000',
  border: '1px solid #D8D8D8',
  borderRadius: '8px',
  padding: '4px 8px',
  marginLeft: '8px',
  cursor: 'pointer',
  fontWeight:'600',
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const Header = ({
  language,
  languages,
  fetchError,
  handleLanguageChange,
  handleRunAllTestCases,
  handleSubmit,
  handleReset,
  isRunning,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <HeaderWrapper elevation={1} style={{backgroundColor: isDarkMode ? '#121212':'#FFFFFF'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {fetchError ? (
          <Typography color="error">{fetchError}</Typography>
        ) : (
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
          >
            {languages.map((lang) => (
              <MenuItem key={lang.language} value={lang.language}>
                {lang.language.charAt(0).toUpperCase() + lang.language.slice(1)}
              </MenuItem>
            ))}
          </Select>
        )}
        <IconButton color="default" onClick={handleReset} size="small" style={{ marginLeft: '16px' }}>
          <RefreshIcon />
        </IconButton>
      </div>
      <div>
        <StyledButton
          onClick={handleRunAllTestCases}
          disabled={isRunning}
          isDarkMode={isDarkMode}
        >
         <div>
      {isRunning ? 'Running...' : (
        <>
          <IoPlay style={{ marginRight: '4px' }} />
          Run
        </>
      )}
    </div>
        </StyledButton>
        <StyledButton 
          style={{color:'#16A35A', fontWeight:'600', backgroundColor: isDarkMode ? '#121212':'#FFFFFF',}}
          onClick={handleSubmit}
          disabled={isRunning}
        >
          <LuUpload/> Submit
        </StyledButton>
      </div>
    </HeaderWrapper>
  );
};

export default Header;