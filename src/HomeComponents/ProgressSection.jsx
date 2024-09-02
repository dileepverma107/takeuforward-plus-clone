import React from 'react';
import { Box, Typography, LinearProgress, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}));

const LinearProgressBox = styled(Box)(({ theme }) => ({
  height: 'calc(100% - 30px)', // Subtract the header height
  overflowY: 'auto',
  paddingRight: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#EFEAEA',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#FF0000',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.grey[500],
  },
}));

const CircularProgressBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  position: 'relative',
}));

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={120} height={120}>
        <circle
          cx={60}
          cy={60}
          r={54}
          fill="none"
          stroke="#EFEAEA"
          strokeWidth={12}
        />
        <circle
          cx={60}
          cy={60}
          r={54}
          fill="none"
          stroke="#FF0000"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${props.value * 3.39}, 339`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const HeaderTypography = styled(Typography)(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode? '#1E1E1E' : theme.palette.background.paper,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '100%',
  position: 'sticky',
  top: 0,
  zIndex: 1,
 
}));

function ProgressSection({ questions, isDarkMode }) {
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    questions?.forEach(question => {
      const { category, solved } = question;
      if (!counts[category]) {
        counts[category] = { solved: 0, unsolved: 0 };
      }
      if (solved === 'true' || solved === true) {
        counts[category].solved += 1;
      } else {
        counts[category].unsolved += 1;
      }
    });
    return counts;
  }, [questions]);

  const overallProgress = React.useMemo(() => {
    const totalSolved = Object.values(categoryCounts).reduce((sum, { solved }) => sum + solved, 0);
    const totalQuestions = questions?.length || 0;
    return totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  }, [categoryCounts, questions]);

  return (
    <ProgressBox>
      <HeaderTypography variant="h6" isDarkMode={isDarkMode}>
        Progress
      </HeaderTypography>
      <Grid container spacing={2} style={{ height: 'calc(100% - 48px)' }}>
        <Grid item xs={8} style={{ height: '100%' }}>
          <LinearProgressBox>
            {Object.entries(categoryCounts).map(([category, { solved, unsolved }]) => {
              const total = solved + unsolved;
              const progress = total > 0 ? (solved / total) * 100 : 0;
              return (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{category}</Typography>
                    <Typography variant="body2">{`${progress.toFixed(0)}%`}</Typography>
                  </Box>
                  <LinearProgress 
  variant="determinate" 
  value={progress} 
  sx={{
    height: '8px',
    borderRadius: '5px',
    backgroundColor: '#EFEAEA',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#FF0000'
    }
  }}
/>
                </Box>
              );
            })}
          </LinearProgressBox>
        </Grid>
        <Grid item xs={4} style={{ height: '100%' }}>
          <CircularProgressBox>
            <CircularProgressWithLabel value={overallProgress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Overall
            </Typography>
          </CircularProgressBox>
        </Grid>
      </Grid>
    </ProgressBox>
  );
}

export default ProgressSection;