import {React, useEffect, useState} from 'react';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ProfileSection from './ProfileSection';
import ProgressSection from './ProgressSection';
import NotesSection from './NoteSection';
import SubmissionCalendar from './SubmissionCalendar';
import {onSnapshot, doc, collection } from 'firebase/firestore';
import { auth, db } from '../AuthComponents/Firebase'; // Adjust the path as needed
import { onAuthStateChanged } from 'firebase/auth';
import LeetCodeStatsWidget from '../LeetCodeComponents/LeetCodeStatsWidget';



function App() {
const [user, setUser] = useState(null);
const [questions, setQuestions] = useState([]);
const theme = useTheme();
const isDarkMode = theme.palette.mode === 'dark';
console.log(isDarkMode);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    console.log(auth);
    console.log(currentUser);
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!user) return;

  const userQuestionsDoc = doc(db, 'userQuestions', user.uid);
  const questionsCollection = collection(userQuestionsDoc, 'questions');
  const unsubscribe = onSnapshot(questionsCollection, (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
      const total = data.reduce((sum, question) => sum + (question.points || 0), 0);
    } else {
      console.log('No questions found for this user');
    }
  }, (error) => {
    console.error('Error fetching questions:', error);
  });
  return () => unsubscribe();

}, [user]);

  return (
      <>
      <Box 
        sx={{ 
          height: '100vh', 
          overflowY: 'auto', 
          msOverflowStyle: 'none',  // Hide scrollbar in Internet Explorer and Edge
          scrollbarWidth: 'none',  // Hide scrollbar in Firefox
          '&::-webkit-scrollbar': {  // Hide scrollbar in Chrome, Safari, and newer versions of Edge
            display: 'none'
          }
        }}
      >
        <Box sx={{ p: 2, mb: 12,  mt:2}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ProfileSection questions = {questions} isDarkMode={isDarkMode}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <ProgressSection questions = {questions} isDarkMode={isDarkMode}/>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <NotesSection isDarkMode={isDarkMode}/>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <SubmissionCalendar questions = {questions} isDarkMode={isDarkMode}/>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <LeetCodeStatsWidget isDarkMode={isDarkMode}/>
      </>
   
  );
}

export default App;