import React, { useState } from 'react';
import { Typography, Box, Divider, Button, useTheme } from '@mui/material';

const ProblemSolvingStatsCard = ({ problemsData, isDarkMode }) => {
  const [showMoreAdvanced, setShowMoreAdvanced] = useState(false);
  const [showMoreIntermediate, setShowMoreIntermediate] = useState(false);
  const [showMoreFundamental, setShowMoreFundamental] = useState(false);
  
  const theme = useTheme();
  
  const maxVisibleSkills = 2;
  const skills = problemsData?.matchedUser?.tagProblemCounts || [];
  const languages = problemsData?.matchedUser?.languageProblemCount || [];

  const getStyles = (isDark) => ({
    card: {
      
      color: isDark ? 'theme.palette.common.white' : theme.palette.text.primary,
    },
    chip: {
      backgroundColor: isDark ? '#555555' : theme.palette.grey[300],
      color: isDark ? theme.palette.common.white : theme.palette.text.primary,
    },
    button: {
      color: isDark ? theme.palette.primary.light : theme.palette.primary.main,
    },
    divider: {
      backgroundColor: isDark ? theme.palette.grey[700] : theme.palette.grey[300],
    },
  });

  const styles = getStyles(isDarkMode);

  const renderSkills = (skillSet, showMore, setShowMore) => {
    const displayedSkills = showMore ? skillSet : skillSet?.slice(0, maxVisibleSkills);

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {displayedSkills?.map((skill, index) => (
          <Box 
            key={index} 
            sx={{ 
              ...styles.chip,
              borderRadius: 1, 
              padding: '4px 8px',
              display: 'inline-block'
            }}
          >
            <Typography variant="body2" component="span">
              {`${skill.tagName} (${skill.problemsSolved})`}
            </Typography>
          </Box>
        ))}
        {skillSet?.length > maxVisibleSkills && (
          <Button 
            variant="text" 
            size="small" 
            onClick={() => setShowMore(!showMore)}
            sx={styles.button}
          >
            {showMore ? 'Show less' : 'Show more...'}
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box sx={styles.card}>
      <Typography variant="subtitle1">Languages:</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {languages.map((language, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box 
              sx={{ 
                ...styles.chip,
                borderRadius: 1, 
                padding: '4px 8px',
                display: 'inline-block'
              }}
            >
              <Typography variant="body2" component="span">
                {language.languageName}
              </Typography>
            </Box>
            <Typography variant="body2" component="span" sx={{ marginLeft: 'auto' }}>
              {language.problemsSolved} problem solved
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 2, ...styles.divider }} />
      <Typography variant="subtitle1">Skills:</Typography>
      <Typography variant="subtitle2">Advanced:</Typography>
      {renderSkills(skills.advanced, showMoreAdvanced, setShowMoreAdvanced)}
      <Typography variant="subtitle2">Intermediate:</Typography>
      {renderSkills(skills.intermediate, showMoreIntermediate, setShowMoreIntermediate)}
      <Typography variant="subtitle2">Fundamental:</Typography>
      {renderSkills(skills.fundamental, showMoreFundamental, setShowMoreFundamental)}
    </Box>
  );
};

export default ProblemSolvingStatsCard;