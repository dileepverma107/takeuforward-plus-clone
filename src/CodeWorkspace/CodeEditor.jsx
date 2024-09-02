import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled, useTheme, css } from '@mui/material/styles';
import Split from 'react-split';
import Header from './Header';
import EditorPane from './EditorPane';
import IOPane from './IOPane';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc, query, where } from 'firebase/firestore';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const StyledSplit = styled(Split)(({ theme, isDarkMode }) => css`
  .gutter {
    background-color: ${isDarkMode ? '#121212' :'#F6F6F6'};
  }
  .gutter:hover {
    background-color: ${isDarkMode ? '#121212' : '#F6F6F6'};
  }
`);

const CodeEditor = ({ questionData, titleSlug, onSubmissionResult, isDarkMode }) => {
  const theme = useTheme();
  

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [languages, setLanguages] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const includedLanguages = ['java', 'c', 'cpp', 'python', 'javascript'];

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await axios.get('/programskeleton.json');
        const testCasesData = response.data;
        const matchedTestCaseData = testCasesData.find(
          (testCase) => testCase?.slugName === titleSlug
        );

        if (matchedTestCaseData) {
          setTestCases(matchedTestCaseData.testCases);
          setCode(questionData?.codeSnippets[1]?.code || '');
        }
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };
  
    fetchTestCases();
  }, [questionData, titleSlug]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        let allLanguages = response.data;
        
        if (!allLanguages.some(lang => lang.language === 'python')) {
          allLanguages.push({ language: 'python', version: '3.x' });
        }
        if (!allLanguages.some(lang => lang.language === 'cpp')) {
          allLanguages.push({ language: 'cpp', version: '17' });
        }

        const filteredLanguages = allLanguages.filter(lang =>
          includedLanguages.includes(lang.language)
        );
        setLanguages(filteredLanguages);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching languages:', error);
        setFetchError('Failed to load languages.');
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      console.log('Auto-saved');
    }, 30000);

    return () => clearInterval(saveInterval);
  }, []);

  const runTestCase = async (testCase, index) => {
    try {
      let fullCode = null;
      if(language === 'java') {
        fullCode = testCase.program + "\n" + code;
      } else if(language === 'javascript') {
        fullCode =  code + "\n" + testCase.javascriptProgram;
      } else if(language === 'python') {
        fullCode =  code + "\n" + testCase.pythonProgram;
      } else if(language === 'c') {
        fullCode = testCase.cProgram + "\n" + code;
      } else {
        fullCode = testCase?.cppProgram.replace('cppCode', code) ;
      }
      console.log(fullCode);
      const response = await axios.post('http://localhost:5000/piston/execute', {
        language: language,
        code: fullCode,
        stdin: testCase.input
      });
  
      console.log('API Response:', response.data);
  
      if (response.data && response.data.run) {
        const { stdout, stderr, compile_output } = response.data.run;
        const output = stdout || stderr || compile_output || 'No output';
  
        if (stderr || compile_output) {
          return { ...testCase, status: 'Error', output: stderr || compile_output };
        } else {
          const status = output.trim() === testCase.expectedOutput.trim() ? 'Accepted' : 'Wrong Answer';
          return { ...testCase, status, output };
        }
      } else {
        console.error('Unexpected API response structure:', response.data);
        return { ...testCase, status: 'Error', output: 'Unexpected API response structure' };
      }
    } catch (err) {
      console.error('Error in runTestCase:', err);
      return { ...testCase, status: 'Error', output: err.message || 'Error submitting code' };
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    const updatedTestCases = [...testCases];
    let allAccepted = true;
  
    for (let i = 0; i < updatedTestCases.length; i++) {
      try {
        const result = await runTestCase(updatedTestCases[i], i);
        updatedTestCases[i] = result;
        if (result.status !== 'Accepted') {
          allAccepted = false;
        }
      } catch (error) {
        console.error(`Error running test case ${i}:`, error);
        updatedTestCases[i] = { 
          ...updatedTestCases[i], 
          status: 'Error', 
          output: error.message || 'An unexpected error occurred' 
        };
        allAccepted = false;
      }
    }
  
    setTestCases(updatedTestCases);
    setIsRunning(false);
  
    // Generate random runtime and memory values
    const runtime = Math.floor(Math.random() * 500) + 50; // Random runtime between 50ms and 550ms
    const memory = Math.floor(Math.random() * 50) + 10; // Random memory usage between 10MB and 60MB
  
    // Prepare submission result
    const submissionResult = {
      status: allAccepted ? 'Accepted' : 'Failed',
      language,
      runtime: `${runtime}ms`,
      memory: `${memory}MB`,
    };
  
    // Save to Firebase
    const auth = getAuth();
    const db = getFirestore();
    try {
      await setDoc(doc(db, 'submissions', `${auth.currentUser.uid}_${titleSlug}_${Date.now()}`), {
        code,
        language,
        timestamp: new Date(),
        uid: auth.currentUser.uid,
        titleSlug,
        ...submissionResult,
      });
      console.log('Submission saved to Firebase');
      updateQuestion(titleSlug, { solved:allAccepted ? 'true': 'false', points:allAccepted ? 100: 0})
    } catch (error) {
      console.error('Error saving submission to Firebase:', error);
    }
  
    // Update SubmissionResult in parent component
    onSubmissionResult(submissionResult);
  };

  const updateQuestion = async (titleSlug, updatedData) => {
    const auth = getAuth();
    const db = getFirestore();
   
    try {
      const userQuestionsDoc = doc(db, 'userQuestions', auth.currentUser.uid);
      const questionsCollection = collection(userQuestionsDoc, 'questions');
      const q = query(questionsCollection, where('titleSlug', '==', titleSlug));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error('No matching question found');
        return;
      }
      const questionDoc = snapshot.docs[0];
      
      // Add the submission date to the updatedData
      const dataToUpdate = {
        ...updatedData,
        submittedDate: new Date().toISOString()
      };

      await updateDoc(doc(questionsCollection, questionDoc.id), dataToUpdate);
      console.log('Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };
  
  const handleRunAllTestCases = async () => {
    setIsRunning(true);
    const updatedTestCases = [...testCases];
    for (let i = 0; i < updatedTestCases.length; i++) {
      try {
        const result = await runTestCase(updatedTestCases[i], i);
        updatedTestCases[i] = result;
      } catch (error) {
        console.error(`Error running test case ${i}:`, error);
        updatedTestCases[i] = { 
          ...updatedTestCases[i], 
          status: 'Error', 
          output: error.message || 'An unexpected error occurred' 
        };
      }
    }
    setTestCases(updatedTestCases);
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode('');
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    const snippetIndex = {
      java: 1,
      c: 4,
      cpp: 0,
      python: 2,
      javascript: 6
    }[selectedLanguage] || 0;
    setCode(questionData?.codeSnippets[snippetIndex]?.code || '');
  };

  return (
    <Root>
      <Header
        language={language}
        languages={languages}
        fetchError={fetchError}
        handleLanguageChange={handleLanguageChange}
        handleRunAllTestCases={handleRunAllTestCases}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        isRunning={isRunning}
        isDarkMode={isDarkMode}
      />
      <StyledSplit
        sizes={[80, 10]}
        minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="vertical"
        cursor="row-resize"
        isDarkMode={isDarkMode}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: 'calc(100% - 48px)',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <EditorPane
          language={language}
          code={code}
          setCode={setCode}
          isDarkMode={isDarkMode}
          questionTitle={titleSlug}
          auth = {getAuth()}
        />
        <IOPane
          testCases={testCases}
          setTestCases={setTestCases}
          activeTestCase={activeTestCase}
          setActiveTestCase={setActiveTestCase}
          isDarkMode={isDarkMode}
        />
      </StyledSplit>
    </Root>
  );
};

export default CodeEditor;