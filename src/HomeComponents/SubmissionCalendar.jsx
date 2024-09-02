import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflowX: 'auto',
}));

const MonthGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

const DayCell = styled(Box)(({ theme, submissionCount }) => ({
  width: 10,
  height: 10,
  backgroundColor: 
    submissionCount === 0 ? theme.palette.grey[200] :
    submissionCount < 3 ? theme.palette.success.light :
    theme.palette.success.dark,
  borderRadius: 2,
  margin: 1,
  display: 'inline-block',
}));

function SubmissionCalendar({ questions }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const last12Months = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      });
    }
    return months;
  }, [today]);

  const submissionDates = useMemo(() => {
    const dates = {};
    questions.forEach(question => {
      if (question.submittedDate) {
        const date = new Date(question.submittedDate);
        date.setHours(0, 0, 0, 0);
        const dateString = date.toISOString().split('T')[0];
        dates[dateString] = (dates[dateString] || 0) + 1;
      }
    });
    return dates;
  }, [questions]);

  const totalSubmissions = Object.values(submissionDates).reduce((a, b) => a + b, 0);

  return (
    <CalendarContainer>
      <Typography variant="h6" gutterBottom>
        {totalSubmissions} submissions in the past one year
      </Typography>
      <MonthGrid container spacing={1}>
        {last12Months.map((month) => (
          <Grid item key={`${month.year}-${month.month}`} xs>
            <Typography variant="caption" color="textSecondary">
              {month.name}
            </Typography>
          </Grid>
        ))}
      </MonthGrid>
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {last12Months.map((month) => (
          <Box key={`${month.year}-${month.month}`} sx={{ minWidth: 70, mr: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[...Array(month.days)].map((_, index) => {
                const day = index + 1;
                const date = new Date(month.year, month.month, day);
                date.setHours(0, 0, 0, 0);
                const dateString = date.toISOString().split('T')[0];
                const submissionCount = submissionDates[dateString] || 0;
                const isVisible = date <= today;
                return isVisible ? (
                  <DayCell 
                    key={day} 
                    submissionCount={submissionCount}
                  />
                ) : null;
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </CalendarContainer>
  );
}

export default SubmissionCalendar;