import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ProgressIndicator from './ProgressIndicator';

const AcceptanceAttemptStatsCard = ({ profileData, isDarkMode }) => {
  const totalSubm = profileData?.matchedUser?.submitStats?.totalSubmissionNum.reduce((acc, curr) => acc + curr.submissions, 0);
  const acSubmission = profileData?.matchedUser?.submitStats?.acSubmissionNum.reduce((acc, curr) => acc + curr.submissions, 0);
  const percentageCal = (profileData?.matchedUser?.submitStats?.acSubmissionNum[0].count / profileData?.allQuestionsCount[0]?.count) * 100;
  const acceptanceRate = (acSubmission / totalSubm) * 100;
  const acceptanceRateInteger = Math.floor(acceptanceRate).toString();
  const acceptanceRateDecimal = (acceptanceRate % 1).toFixed(2).substring(1);

  const darkModeStyles = {
    card: {
      backgroundColor: isDarkMode ? '#121212' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    typography: {
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    difficultyCard: {
      backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
    },
  };

  return (
    <Card style={{ 
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
      height: '100%',
      ...darkModeStyles.card 
    }}>
      <CardContent style={{ marginTop: '20px' }}>
        <Box display="flex" alignItems="center">
          <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressIndicator
              progress={percentageCal.toFixed(2)}
              progressText={
                <>
                  <Typography variant="h4" component="span" style={{ fontWeight: 'bold', ...darkModeStyles.typography }}>
                    {profileData?.matchedUser?.submitStats?.acSubmissionNum[0].count}
                  </Typography>
                  /
                  <span style={darkModeStyles.typography}>
                    {profileData?.allQuestionsCount[0]?.count}
                  </span>
                </>
              }
              progressColor="#1CBABA"
              backgroundColor={isDarkMode ? "#3a3a3a" : "#264545"}
              submission="9 Attempting"
              hoverProgress={acceptanceRate.toFixed(2)}
              hoverProgressText={
                <>
                  <Typography variant="h4" component="span" style={{ fontWeight: 'bold', ...darkModeStyles.typography }}>
                    {acceptanceRateInteger}
                  </Typography>
                  <Typography component="span" style={{ fontWeight: 'bold', ...darkModeStyles.typography }}>
                    {acceptanceRateDecimal}%
                  </Typography>
                </>
              }
              hoverSubmission={`${totalSubm} submission`}
              isDarkMode={isDarkMode}
            />
          </Box>
          <Box style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box display="flex" flexDirection="column" width="150px">
              {['Easy', 'Medium', 'Hard'].map((difficulty, index) => (
                <Card key={difficulty} style={{ 
                  marginBottom: index < 2 ? 8 : 0, 
                  padding: 5, 
                  textAlign: 'center',
                  ...darkModeStyles.difficultyCard
                }}>
                  <Typography variant="body2" style={{ 
                    color: ['#28BABA', '#FFAB22', '#F63635'][index] 
                  }}>
                    {profileData?.allQuestionsCount[index + 1]?.difficulty}
                  </Typography>
                  <Typography variant="body2" style={darkModeStyles.typography}>
                    {profileData?.matchedUser?.submitStats?.acSubmissionNum[index + 1].count}/
                    {profileData?.allQuestionsCount[index + 1]?.count}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AcceptanceAttemptStatsCard;