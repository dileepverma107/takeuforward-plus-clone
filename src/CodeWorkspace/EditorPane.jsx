import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Editor, { loader } from '@monaco-editor/react';


// Pre-load Monaco Editor
loader.init().then(monaco => {
  // You can customize Monaco instance here if needed
});

const EditorWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: '400px', // Set a fixed height or adjust as needed
}));

const Footer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const EditorPane = ({ language, code, setCode, isDarkMode, questionTitle, auth }) => {
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [editorCode, setEditorCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef(null);
  const wrapperRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const getStorageKey = useCallback(() => {
    return `${auth.currentUser.uid}-${questionTitle}-${language}`;
  }, [auth.currentUser.uid, questionTitle, language]);

  useEffect(() => {
    const savedCode = sessionStorage.getItem(getStorageKey());
    if (savedCode) {
      setEditorCode(savedCode);
      if (setCode) {
        setCode(savedCode);
      }
    } else {
      setEditorCode(code || '');
    }
  }, [getStorageKey, code, setCode]);

  const handleResize = useCallback(() => {
    if (editorRef.current) {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        editorRef.current.layout();
      }, 100);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ lineNumber: e.position.lineNumber, column: e.position.column });
    });

    // Manually trigger a layout update
    handleResize();
  };

  const handleChange = (value) => {
    setEditorCode(value);
    if (setCode) {
      setCode(value);
    }
    sessionStorage.setItem(getStorageKey(), value);
  };

  const getLanguageId = (lang) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'c':
        return 'c';
      case 'cpp':
      case 'c++':
        return 'cpp';
      default:
        return 'plaintext';
    }
  };

  return (
    <EditorWrapper ref={wrapperRef}>
      <Box sx={{ height: 'calc(100% - 32px)', overflow: 'hidden' }}>
        <Editor
          height="95%"
          language={getLanguageId(language)}
          value={editorCode}
          theme={isDarkMode ? 'vs-dark' : 'light'}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          loading={<Typography>Loading editor...</Typography>}
          options={{
            inlineSuggest: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            automaticLayout: true,
            readOnly: false,
            cursorStyle: 'line',
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            formatOnType: true,
            autoClosingBrackets: true,
            
          }}
        />
      </Box>
      {isEditorReady && (
        <Footer>
          <Typography variant="body2">Auto-saved</Typography>
          <Typography variant="body2">
            Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
          </Typography>
        </Footer>
      )}
    </EditorWrapper>
  );
};

export default EditorPane;