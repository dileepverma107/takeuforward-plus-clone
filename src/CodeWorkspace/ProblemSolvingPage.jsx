import React, { useState, useEffect, useRef } from 'react';
import { styled, useTheme, css } from '@mui/material/styles';
import Split from 'react-split';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NoteIcon from '@mui/icons-material/Note';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import CodeEditor from './CodeEditor';
import apiClient from '../apiClient';
import TextEditor from '../DoubtSection/TextEditor';
import SubmissionResult from '../Submission/SubmissionResult';
import { FiBookOpen } from "react-icons/fi";
import NoteEditor from '../Notes/NoteEditor';

const StyledSplit = styled(Split)(({ theme, isDarkMode }) => css`
  .gutter {
    background-color: ${isDarkMode ? '#121212' :'#F6F6F6'};
  }
  .gutter:hover {
    background-color: ${isDarkMode ? '#121212' : '#F6F6F6'};
  }
`);

const ProblemSolvingPage = ({ titleSlug }) => {
  const [tab, setTab] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const submissionRef = useRef(null);
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    const fetchQuestionData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.post('', {
          query: `query getQuestionDetail($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId title difficulty content exampleTestcases codeSnippets { lang langSlug code } topicTags { name slug } hints } }`,
          variables: {
            titleSlug: titleSlug
          },
        });

        if (response.data.errors) {
          setError('Failed to fetch question details. Please try again.');
        } else {
          setQuestionData(response.data.data.question);
          setError('');
        }
      } catch (error) {
        setError('Failed to fetch question details. Please try again.');
        console.error('Error fetching question details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [titleSlug]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSubmissionResult = (result) => {
    setSubmissionResult(result);
    setIsSubmitting(true);
    setTab(2); // Switch to the Submissions tab
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submissionRef.current && !submissionRef.current.contains(event.target)) {
        setIsSubmitting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const CustomTab = ({ icon, label, index, ...props }) => (
    <Tab
      {...props}
      sx={{
        minHeight: '48px',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: 600,
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
          color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.text.primary,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E8E8E8',
        },
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
        },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiTab-iconWrapper': {
          fontSize: '20px',
          marginRight: '8px',
        },
        transition: 'all 0.2s ease-in-out',
        flexGrow: 1,
        maxWidth: 'none',
      }}
      icon={icon}
      label={isMobile ? null : label}
    />
  );

  const renderContent = (content) => {
    const containerDiv = document.createElement('div');
    containerDiv.innerHTML = content;
    const elements = Array.from(containerDiv.childNodes);

    return elements.map((element, index) => {
      if (element.nodeName === 'PRE') {
        return (
          <Box key={index} sx={{ my: 2, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: theme.palette.divider,
              }}
            />
            <SyntaxHighlighter
              language="text"
              style={isDarkMode ? dark : docco}
              customStyle={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f7f9fa',
                padding: '16px 16px 16px 24px',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {element.textContent}
            </SyntaxHighlighter>
          </Box>
        );
      } else {
        return <div key={index} dangerouslySetInnerHTML={{ __html: element.outerHTML }} />;
      }
    });
  };

  return (
    <Container maxWidth="xl" sx={{ width: '100%', height: '610px', mt: 2, mb: 2 }}>
      <StyledSplit
        sizes={[55, 45]}
        minSize={300}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        style={{ display: 'flex', height: '100%' }}
        isDarkMode={isDarkMode}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Tabs 
              value={tab} 
              onChange={handleTabChange} 
              aria-label="problem tabs"
              variant="fullWidth"
              sx={{ 
                height: '48px',
                '& .MuiTabs-flexContainer': {
                  height: '100%',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <CustomTab icon={<DescriptionIcon />} label="Description" index={0} />
              <CustomTab icon={<FiBookOpen />} label="Editorial" index={1} />
              <CustomTab icon={<AssignmentTurnedInIcon />} label="Submissions" index={2} />
              <CustomTab icon={<HelpOutlineIcon />} label="Doubt" index={3} />
              <CustomTab icon={<NoteIcon />} label="Notes" index={4} />
            </Tabs>
          </Box>
          <Box sx={{ 
            p: 3, 
            overflowY: 'auto', 
            flexGrow: 1,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                {tab === 0 && questionData && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      {questionData.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      Difficulty: {questionData.difficulty}
                    </Typography>
                    {renderContent(questionData.content)}
                  </>
                )}
                {tab === 1 && <Typography>Editorial content goes here</Typography>}
                {tab === 2 && (
                  <div ref={submissionRef}>
                    <SubmissionResult 
                      result={submissionResult} 
                      titleSlug={titleSlug} 
                      isSubmitting={isSubmitting} 
                    />
                  </div>
                )}
                {tab === 3 && <TextEditor titleSlug={titleSlug}/>}
                {tab === 4 && <NoteEditor titleSlug={titleSlug} />}
              </>
            )}
          </Box>
        </Paper>
        <Paper 
          elevation={0} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <CodeEditor questionData={questionData} titleSlug={titleSlug} onSubmissionResult={handleSubmissionResult} isDarkMode ={isDarkMode}/>
        </Paper>
      </StyledSplit>
    </Container>
  );
};

export default ProblemSolvingPage;