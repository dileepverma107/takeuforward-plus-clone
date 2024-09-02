import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../AuthComponents/Firebase'; // Adjust the import path according to your project structure
import { onAuthStateChanged } from 'firebase/auth';

function NotesSection({isDarkMode}) {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(isDarkMode);

  useEffect(() => {
    let unsubscribeAuth;

    const fetchNotes = async (userId) => {
      try {
        const notesRef = collection(db, 'notes', userId, 'notes');
        const notesSnapshot = await getDocs(notesRef);
        const notesData = notesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
        console.log(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchNotes(user.uid);
      } else {
        setNotes([]);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const handleOpen = (note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedNote(null);
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Save Notes
      </Typography>
      
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Problem</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : notes.length > 0 ? (
              notes.map((note, index) => (
                <TableRow key={note.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{note.id || 'N/A'}</TableCell>
                  <TableCell>
                  <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        cursor: 'pointer',
                        color: isDarkMode ? '#fff': '#050505',
                        border: '1px solid #D4D4D8',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                      onClick={() => handleOpen(note)}
                    >
                      {'View'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No notes available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      

      
        <Modal open={open} onClose={handleClose} closeAfterTransition>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '90%', sm: 800 },
      bgcolor: 'background.paper',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderRadius: 3,
      overflow: 'hidden',
      outline: 'none',
    }}
  >
    <Box
      sx={{
        borderBottom: '2px solid #E5E7EB',
        background: '#F9F9F9',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ color: '#27272A', fontWeight: '500' }}>
        Save Notes
      </Typography>
      <IconButton onClick={handleClose} sx={{ color: '#27272A' }}>
        <CloseIcon />
      </IconButton>
    </Box>
    
      <Box
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          p: 3,
          maxHeight: '60vh',
          overflowY: 'auto',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Box
          sx={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: selectedNote?.content || 'No content available.' }}
        />
      </Box>
    
  </Box>
</Modal>
    </Box>
  );
}

export default NotesSection;
