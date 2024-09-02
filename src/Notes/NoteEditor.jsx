import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Paper, Button } from '@mui/material';
import { db } from '../AuthComponents/Firebase'; // Adjust the import path as needed
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NoteEditor = ({ titleSlug }) => {
  const [editorContent, setEditorContent] = useState('');
  const [userId, setUserId] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    // Fetch the current user's ID
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Handle user not logged in scenario
        setUserId(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadNote = async () => {
      if (userId && titleSlug) {
        const noteRef = doc(db, 'notes', userId, 'notes', titleSlug);
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
          const noteData = noteSnap.data();
          if (noteData && noteData.content) {
            setEditorContent(noteData.content);
          }
        }
      }
    };
    loadNote();
  }, [userId, titleSlug]);

  const saveNote = async () => {
    console.log(userId + titleSlug);
    if (userId && titleSlug) {
      const noteRef = doc(db, 'notes', userId, 'notes', titleSlug);
      try {
        await setDoc(noteRef, { content: editorContent, updatedAt: new Date() }, { merge: true });
        toast.success('Note saved successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error('Failed to save note. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Error saving note:", error);
      }
    } else {
      toast.warn('Unable to save note. Please make sure you are logged in.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'script',
    'indent',
    'direction',
    'color', 'background',
    'link', 'image'
  ];

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <div style={{ flexGrow: 1, overflow: 'hidden' }}>
          <ReactQuill
            ref={quillRef}
            value={editorContent}
            onChange={setEditorContent}
            modules={modules}
            formats={formats}
            style={{ height: '100%' }}
          />
        </div>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={saveNote}
          sx={{ 
            margin: '16px', 
            alignSelf: 'flex-end',
            fontSize: '0.75rem',
            padding: '6px 12px',
            backgroundColor:'#D41F30',
          }}
        >
          Save Note
        </Button>
      </Paper>
      <ToastContainer />
    </>
  );
};

export default NoteEditor;
