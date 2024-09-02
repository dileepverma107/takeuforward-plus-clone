import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Modal,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MdMemory, MdOutlineWatchLater, MdAccessTime, MdCode, MdVisibility, MdContentCopy, MdClose } from "react-icons/md";
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { GoCodescan } from "react-icons/go";
import apiClient from '../apiClient';
import AnalysisModal from './AnalysisModal';
import { vscodeDark, githubLight } from '@uiw/codemirror-themes-all';

const solvedImage = "/circle-wavy-check.svg";

const cleanContent = (code) => {
  // Implement your code cleaning logic here
  return code;
};

const SubmissionResult = ({ result, titleSlug, isSubmitting }) => {
  const [submissions, setSubmissions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [openAnalysisModal, setOpenAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [languageSubmission, setLanguageSubmission] = useState(null);
  const [analysisFlag, setanalysisFlag] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const submissionsRef = collection(db, 'submissions');
      const q = query(
        submissionsRef,
        where('uid', '==', auth.currentUser.uid),
        where('titleSlug', '==', titleSlug),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
    };

    fetchSubmissions();
  }, [titleSlug]);

  const handleOpenModal = (code) => {
    setSelectedCode(code);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedCode);
  };

  const handleAnalyzeCode = async (code, param, lang) => {
    setIsAnalyzing(true);
    setOpenAnalysisModal(true);
    setLanguageSubmission(lang);
    setanalysisFlag(param);
    try {
      let prompt
      if(param === 'analysis') {
       prompt = 'Provide the time and space complexity of this code with a brief 1-2 line explanation for each';
      } else {
        prompt = `Review the following code for a competitive programming problem (e.g., LeetCode). Provide improvement suggestions focusing on:

1. First, repeat the entire original code without modifications.
2. After the code, list improvement suggestions as numbered comments.
3. Each comment should:
   a. Start with the line number or range it refers to.
   b. Clearly indicate what could be optimized or improved.
   c. Briefly explain how the change would enhance performance or solve edge cases.
4. Focus exclusively on:
   - Time complexity optimizations
   - Space complexity improvements
   - Handling of edge cases
   - More efficient data structures or algorithms for that question only
   - Potential integer overflow issues for that question only
   - Opportunities to reduce redundant calculations for this
   - focus on naming conventions of variables for this
5. Do not suggest stylistic changes or language-specific features unless they significantly impact runtime or memory usage.
6. Keep comments very very concise but informative.
7. Dont repeat words and comments.

Your response should contain only the original code provided by me  followed by the numbered list of relevant improvement suggestions for competitive programming scenarios. Do not include any other text or explanations even dont include like this is original code this is..`;
      }
      const cleanedText = prompt +'\n'+cleanContent(code);
      const response = await apiClient.post('http://localhost:5000/ai-completion', { content: cleanedText });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setAnalysisResult({ error: 'Failed to analyze code' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseAnalysisModal = () => {
    setOpenAnalysisModal(false);
    setAnalysisResult(null);
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} days ago`;
    }
  };

  return (
    <Box sx={{ color: isDarkMode ? 'text.primary' : 'inherit' }}>
      {isSubmitting && result && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Current submission
            </Typography>
            <Box>
              <Chip 
                icon={<MdAccessTime />} 
                label="Time Complexity" 
                size="small" 
                sx={{ mr: 1, bgcolor: isDarkMode ? 'action.selected' : 'inherit' }}
                clickable
              />
              <Chip 
                icon={<MdCode />} 
                label="Code Review" 
                size="small" 
                sx={{ bgcolor: isDarkMode ? 'action.selected' : 'inherit' }}
                clickable
              />
            </Box>
          </Box>
          <Card variant="outlined" sx={{ p: 2, mb: 4, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography 
                variant="h5" 
                color={result.status === 'Accepted' ? "#16A34A" : '#DC2626'} 
                sx={{ fontWeight: 'bold' }}
              >
               {result.status === 'Accepted' ? "Accepted" : 'Wrong Answer'}
              </Typography>
              <Box>
                <Chip 
                  icon={<MdOutlineWatchLater />} 
                  label={result.runtime} 
                  size="small" 
                  sx={{ mr: 1, bgcolor: isDarkMode ? 'action.selected' : 'inherit' }}
                />
                <Chip 
                  icon={<MdMemory />} 
                  label={result.memory} 
                  size="small" 
                  sx={{ bgcolor: isDarkMode ? 'action.selected' : 'inherit' }}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              {['Compilation Check', 'Test Cases (small)', 'Test Cases (large)'].map((label, index) => (
                <Box 
                  key={index} 
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    backgroundColor: isDarkMode
                      ? (result.status === 'Failed' && label !== 'Compilation Check' ? '#3B0D0C' : '#0D3B0C')
                      : (result.status === 'Failed' && label !== 'Compilation Check' ? '#FEF3F2' : '#F2FEF3'),
                    borderRadius: '8px',
                    padding: '12px',
                    width: '30%',
                  }}
                > 
                  <img src={solvedImage} alt='Solved Icon' style={{ marginBottom: '8px', width: '24px', height: '24px', alignSelf: 'flex-start' }}/>
                  <Typography variant="body2" color={result.status === 'Failed' && label !== 'Compilation Check'? "#DC2626" : '#16A34A'} fontSize='16px'>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </>
      )}
      <Typography variant="h6" gutterBottom>
        Previous submissions
      </Typography>
      <TableContainer 
        sx={{ 
          maxHeight: 400, 
          overflowY: 'auto',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
          borderRadius: '4px',
          bgcolor: isDarkMode ? 'background.paper' : 'inherit',
        }}
      >
        <Table stickyHeader sx={{ minWidth: isMobile ? 'auto' : 650 }} aria-label="submissions table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>Status</TableCell>
              <TableCell sx={{ minWidth: 80, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>Language</TableCell>
              <TableCell sx={{ minWidth: 60, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>Code</TableCell>
              <TableCell sx={{ minWidth: 80, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>Analyze</TableCell>
              <TableCell sx={{ minWidth: 80, bgcolor: isDarkMode ? 'background.paper' : 'inherit' }}>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <Typography color={submission.status === 'Accepted' ? "#16A34A" : '#DC2626'}>
                    {submission.status === 'Accepted' ? "Accepted" : 'Wrong Answer'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(submission.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={submission.language} size="small" sx={{ bgcolor: isDarkMode ? 'action.selected' : 'inherit' }} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(submission.code)}>
                    <MdVisibility />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {submission.status === 'Accepted' ? (
                    <IconButton onClick={() => handleAnalyzeCode(submission.code, 'analysis', submission.language)}>
                      <GoCodescan style={{fontSize:'1.3rem'}}/>
                    </IconButton>
                  ) : '-'}
                </TableCell>
                <TableCell>
                {submission.status === 'Accepted' ? (
                  <Typography 
                    color="primary" 
                    onClick={() => handleAnalyzeCode(submission.code, 'view', submission.language)} 
                    style={{ cursor: 'pointer' }}
                  >
                    View
                  </Typography>
                ) : (
                  <Typography color="textSecondary">-</Typography>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Code Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="code-modal-title"
        aria-describedby="code-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          bgcolor: isDarkMode ? 'background.paper' : 'background.default',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#000'}`,
          boxShadow: 24,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            p: 2,
            height:'50px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Typography variant="h6" component="h2" sx={{ color: isDarkMode ? 'text.primary' : 'black' }}>
              Code
            </Typography>
            <Box>
              <IconButton onClick={handleCopyCode} sx={{ color: isDarkMode ? 'text.primary' : 'black', mr: 1 }}>
                <MdContentCopy />
              </IconButton>
              <IconButton onClick={handleCloseModal} sx={{ color: isDarkMode ? 'text.primary' : 'black' }}>
                <MdClose />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{
        p: 2,
        height: '400px',
        overflow: 'hidden', // Hide the scrollbars on the container
        '& .cm-scroller': {
          overflow: 'scroll', // Keep the content scrollable
          scrollbarWidth: 'none', // For Firefox
          '&::-webkit-scrollbar': {
            display: 'none' // For WebKit browsers
          }
        }
      }}>
            <CodeMirror
              value={selectedCode}
              height="100%"
              extensions={[java()]}
              editable={false}
              theme={isDarkMode ? vscodeDark : githubLight}
            />
          </Box>
        </Box>
      </Modal>

      {/* Analysis Modal */}
      <AnalysisModal
        open={openAnalysisModal}
        onClose={handleCloseAnalysisModal}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        languageSubmission={languageSubmission}
        analysisFlag={analysisFlag}
        isDarkMode={isDarkMode}
      />
    </Box>
  );
};

export default SubmissionResult;