import React from 'react';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ErrorAlert = ({ errorMessage, onClose }) => {
  return (
    errorMessage && (
      <Alert
        severity="error"
        sx={{ marginBottom: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {errorMessage}
      </Alert>
    )
  );
};

export default ErrorAlert;
