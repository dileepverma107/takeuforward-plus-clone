import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { GoMoveToEnd, GoMoveToStart } from "react-icons/go";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Typography, 
  Box, 
  IconButton,
  LinearProgress,
  Divider,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { VscFolderOpened } from "react-icons/vsc";
import { BsFolder2 } from "react-icons/bs";
import {
  Home,
  Forum,
  Map,
  Event,
  ChevronRight,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { db,auth } from '../AuthComponents/Firebase';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const drawerWidth = 255;
const solvedImage = "/solved.svg";
const unsolvedImage = "/unsolved.svg";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    primary: {
      main: '#D41F30',
    },
  },
});

const Logo = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '2.2rem',
  
  color: theme.palette.primary.main,
}));

const SmallCardContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}));

const SmallCard = styled(Box)(({ theme, active }) => ({
  padding: theme.spacing(1),
  backgroundColor: '#1E1E1E',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
  '& .MuiSvgIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  '& .MuiTypography-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
}));

const ProgressCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const BeginnerProblemsSection = styled(Collapse)(({ theme }) => ({
  maxHeight: '165px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.dark,
  },
}));

const ScrollableSection = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.dark,
  },
  '& .MuiListItem-root': {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active, open }) => ({
  padding: theme.spacing(0.5, 1),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  ...(active && {
    backgroundColor: 'rgba(255,255,255,0.08)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
  }),
  '& .MuiListItemIcon-root': {
    minWidth: '28px',
    color: open ? theme.palette.primary.main : 'inherit',
  },
}));

const NestedList = styled(List)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

const tooltipStyles = {
  width: '200px',
  textAlign: 'center',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  backgroundColor: '#333',
  color: '#FFF',
};

const Sidebar = ({ open, toggleDrawer, onNavigation }) => {
  const [beginnerOpen, setBeginnerOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState({});
  const [difficultyOpen, setDifficultyOpen] = useState({});
  const [organizedQuestions, setOrganizedQuestions] = useState({});
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (component) => {
    if (component === 'Home') {
      navigate('/');
    } else {
      navigate(`/${component.toLowerCase()}`);
    }
    onNavigation(component);
  };

  useEffect(() => {
    if (!user) return;

    const userQuestionsDoc = doc(db, 'userQuestions', user.uid);
    const questionsCollection = collection(userQuestionsDoc, 'questions');

    // Real-time listener
    const unsubscribe = onSnapshot(questionsCollection, async (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(data);
        organizeQuestions(data);
      } else {
        const response = await fetch('/questions.json');
        const data = await response.json();
        for (const question of data) {
          await setDoc(doc(questionsCollection), question);
        }
        setQuestions(data);
        organizeQuestions(data);
        console.log('Data stored in Firestore for the user for the first time');
      }
    }, (error) => {
      console.error('Error fetching or storing questions:', error);
    });
    return () => unsubscribe();
  }, [user]);

  const organizeQuestions = (questions) => {
    const organized = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = {};
      }
      if (!acc[question.category][question.difficulty]) {
        acc[question.category][question.difficulty] = [];
      }
      acc[question.category][question.difficulty].push(question);
      return acc;
    }, {});
    setOrganizedQuestions(organized);
  };

  const toggleCategory = (category) => {
    setCategoriesOpen(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleDifficulty = (category, difficulty) => {
    setDifficultyOpen(prev => ({
      ...prev,
      [category]: { ...prev[category], [difficulty]: !prev[category]?.[difficulty] }
    }));
  };

  const isQuestionActive = (titleSlug) => location.pathname === `/problem/${titleSlug}`;

  const isCategoryActive = (category) => {
    return Object.keys(organizedQuestions[category] || {}).some(difficulty =>
      isDifficultyActive(category, difficulty)
    );
  };

  const isDifficultyActive = (category, difficulty) => {
    return (organizedQuestions[category]?.[difficulty] || []).some(problem =>
      isQuestionActive(problem.titleSlug)
    );
  };

  const renderProblems = (problems, category, difficulty) => (
    <NestedList component="div" disablePadding>
      {problems.map((problem, index) => (
        <StyledListItem 
          button 
          sx={{ pl: 6 }}
          onClick={() => navigate(`/problem/${problem.titleSlug}`)}
          key={index}
          data-tooltip-id={`problem-${problem.titleSlug}`}
          data-tooltip-content={problem.title}
          active={isQuestionActive(problem.titleSlug)}
        >
          <ListItemIcon sx={{ minWidth: '24px' }}>
            <img src={problem.solved === 'true' ? solvedImage : unsolvedImage} alt={problem.solved ? "Solved" : "Unsolved"} width="20" height="20" style={{color:'#fff'}} />
          </ListItemIcon>
          <ListItemText 
            primary={problem.title} 
            primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500,color: 'rgba(156, 163, 175, 0.8)' }}
            sx={{ 
              '& .MuiTypography-root': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'color 0.3s ease-in-out', // Smooth transition for color change
               },
               '&:hover .MuiTypography-root': {
              color: '#FFFFFF', // Color on hover
             }
            }} 
          />
          <Tooltip id={`problem-${problem.titleSlug}`} place="top" style={tooltipStyles} />
        </StyledListItem>
      ))}
    </NestedList>
  );

  const solvedProblems =  questions.filter(question => question.solved === "true").length; 

  const completionPercentage = (solvedProblems * 100 / questions.length).toFixed(0);
  const completedProblems = solvedProblems;
  const totalProblems = questions.length; 

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 0,
            transition: theme =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            backgroundColor: darkTheme.palette.background.default,
            overflowY: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Logo>takeUAhead</Logo>

          <SmallCardContainer>
            <SmallCard onClick={() => handleNavigation('Home')} active={location.pathname === '/'}>
              <Home fontSize="small" />
              <Typography variant="caption" style={{fontSize:'13px'}}>Home</Typography>
            </SmallCard>
            <SmallCard onClick={() => handleNavigation('Discussion')} active={location.pathname === '/discussion'}>
              <Forum fontSize="small" />
              <Typography variant="caption" style={{fontSize:'13px'}}>Discussions</Typography>
            </SmallCard>
            <SmallCard onClick={() => handleNavigation('Roadmap')} active={location.pathname === '/roadmap'}>
              <Map fontSize="small" />
              <Typography variant="caption" style={{fontSize:'13px'}}>Roadmap</Typography>
            </SmallCard>
            <SmallCard onClick={() => handleNavigation('Session')} active={location.pathname === '/session'}>
              <Event fontSize="small" />
              <Typography variant="caption" style={{fontSize:'13px'}}>Sessions</Typography>
            </SmallCard>
          </SmallCardContainer>

          <Divider />

          <List>
          <StyledListItem 
            button 
            onClick={() => setBeginnerOpen(!beginnerOpen)}
            data-tooltip-id="beginner-problems"
            data-tooltip-content="Beginner Problems"
            active={beginnerOpen}
            open={beginnerOpen}
          >
            <ListItemIcon>
              {beginnerOpen ? <VscFolderOpened  fontSize="large"/> : <BsFolder2 fontSize="large" color="rgba(156, 163, 175, 0.8)" />}
            </ListItemIcon>
            <ListItemText
      primary={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Beginner Problems
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            1/100
          </Typography>
        </Box>
      }
    />
            {beginnerOpen ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem>
          <Tooltip id="beginner-problems" place="top" style={tooltipStyles} />
          <BeginnerProblemsSection in={beginnerOpen} timeout="auto" unmountOnExit>
  <NestedList component="div" disablePadding>
    {['Basics', 'Logic Building', 'Patterns'].map((text, index) => (
      <StyledListItem 
        button 
        sx={{ pl: 4 }} 
        key={text}
        data-tooltip-id={`beginner-${text}`}
        data-tooltip-content={text}
      >
        <ListItemIcon>
          <BsFolder2 fontSize="large" color="rgba(156, 163, 175, 0.8)" />
        </ListItemIcon>
        <ListItemText 
          primary={text} 
          primaryTypographyProps={{ fontSize: '0.8rem' }}
        />
        <Tooltip id={`beginner-${text}`} place="top" style={tooltipStyles} />
      </StyledListItem>
    ))}
  </NestedList>
</BeginnerProblemsSection>
        </List>

          <Divider />

          <ProgressCard>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="subtitle2" color="error">
      {`${completionPercentage}% complete`}
    </Typography>
    <Typography variant="caption" sx={{ color: '#B0B0B0' }}>
      {`${completedProblems}/${totalProblems}`}
    </Typography>
  </Box>
  <LinearProgress 
    variant="determinate" 
    value={completionPercentage} 
    sx={{ 
      marginTop:'5px',
      borderRadius:'2px',
      backgroundColor: 'rgba(255,255,255,0.1)', 
      '& .MuiLinearProgress-bar': { backgroundColor: '#D41F30' } 
    }} 
  />
</ProgressCard>

          <Divider />

          <ScrollableSection>
          <List>
            {Object.keys(organizedQuestions).map(category => (
              <React.Fragment key={category}>
                <StyledListItem 
                  button 
                  onClick={() => toggleCategory(category)}
                  data-tooltip-id={`category-${category}`}
                  data-tooltip-content={category}
                  active={isCategoryActive(category)}
                  open={categoriesOpen[category]}
                >
                    <ListItemIcon>
                    {categoriesOpen[category] ? <VscFolderOpened  fontSize="large" /> : <BsFolder2 fontSize="large" color="rgba(156, 163, 175, 0.8)"/>}
                  </ListItemIcon>
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                  {categoriesOpen[category] ? <ExpandLess /> : <ChevronRight />}
                </StyledListItem>
                <Tooltip id={`category-${category}`} place="top" style={tooltipStyles} />
                <Collapse in={categoriesOpen[category]} timeout="auto" unmountOnExit>
                  <NestedList component="div" disablePadding>
                    {Object.keys(organizedQuestions[category] || {}).map(difficulty => (
                      <React.Fragment key={difficulty}>
                        <StyledListItem 
                          button 
                          onClick={() => toggleDifficulty(category, difficulty)} 
                          sx={{ pl: 4 }}
                          data-tooltip-id={`difficulty-${category}-${difficulty}`}
                          data-tooltip-content={difficulty}
                          active={isDifficultyActive(category, difficulty)}
                          open={difficultyOpen[category]?.[difficulty]}
                        >
                          <ListItemIcon>
                            {difficultyOpen[category]?.[difficulty] ? <VscFolderOpened  fontSize="large" /> : <BsFolder2 fontSize="large" color="rgba(156, 163, 175, 0.8)"/>}
                          </ListItemIcon>
                          <ListItemText 
                            primary={difficulty} 
                            primaryTypographyProps={{ fontSize: '0.8rem' }}
                          />
                          {difficultyOpen[category]?.[difficulty] ? <ExpandLess /> : <ChevronRight />}
                        </StyledListItem>
                        <Tooltip id={`difficulty-${category}-${difficulty}`} place="top" style={tooltipStyles} />
                        <Collapse in={difficultyOpen[category]?.[difficulty]} timeout="auto" unmountOnExit>
                          {renderProblems(organizedQuestions[category]?.[difficulty] || [], category, difficulty)}
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </NestedList>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </ScrollableSection>
      </Box>
    </Drawer>

    <Box
      sx={{
        position: 'fixed',
        bottom: 50,
        left: open ? drawerWidth - 20 : -20,
        zIndex: 1,
        p: 0.5,
        backgroundColor: '#D41F30',
        borderRadius: '17%',
        boxShadow: '0 0 10px rgba(255,255,255,0.2)',
        height:'30px',
        width:'50px'
      }}
    >
      <IconButton 
        onClick={toggleDrawer} 
        sx={{ 
          height: '3px', 
          width:'35px', 
          marginLeft:'12px', 
          marginBottom:'5px', 
          color: darkTheme.palette.text.primary 
        }}
      >
        {open ? <GoMoveToStart/> : <GoMoveToEnd/>}
      </IconButton>
    </Box>
  </ThemeProvider>
);
};

export default Sidebar;