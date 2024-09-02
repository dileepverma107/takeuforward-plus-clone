import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Select, MenuItem, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';

const ActivityStatsCard = ({ profileData }) => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const isMobile = useMediaQuery('(max-width:600px)');

  const submissionCalendar = profileData?.matchedUser.submissionCalendar
  ? JSON.parse(profileData.matchedUser.submissionCalendar)
  : {
    "1707609600": 2, "1707696000": 2, "1707782400": 3, "1707868800": 2,
    "1708905600": 6, "1708992000": 5, "1709596800": 3, "1709683200": 1,
    "1709942400": 2, "1710201600": 1, "1710460800": 2, "1710547200": 2,
    "1710633600": 2, "1710720000": 2, "1710806400": 1, "1710979200": 1,
    "1711756800": 1, "1711929600": 2, "1712016000": 2, "1712448000": 2,
    "1712620800": 3, "1712793600": 3, "1713052800": 4, "1713225600": 1,
    "1713657600": 1, "1714435200": 5, "1714521600": 1, "1715472000": 2,
    "1715558400": 4, "1716681600": 6, "1716940800": 1, "1717027200": 1,
    "1717372800": 1, "1717459200": 1, "1717891200": 2, "1717977600": 3,
    "1718236800": 1, "1719014400": 1, "1719187200": 11, "1719360000": 3,
    "1719446400": 3, "1719619200": 1, "1719705600": 4, "1719792000": 3,
    "1719878400": 5, "1719964800": 19, "1720051200": 4, "1720310400": 6,
    "1720569600": 13, "1720656000": 6, "1720828800": 2, "1720915200": 1,
    "1721001600": 6, "1721088000": 19, "1721260800": 6, "1721433600": 11,
    "1721520000": 2, "1721692800": 3, "1721779200": 2, "1721865600": 1,
    "1721952000": 5, "1691798400": 10, "1691884800": 3, "1692057600": 1
  };

  console.log('Profile Data:', profileData);


  // Calculate the 12 months from the previous to the current month
  const getMonths = (year) => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = dayjs().year(year).subtract(i, 'month');
      months.push({
        label: date.format('MMM'),
        year: date.year(),
        month: date.month()
      });
    }
    return months;
  };

  const months = getMonths(selectedYear);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Helper function to get highlighted dates
  const getHighlightedDates = (monthIndex, year) => {
    const startDate = dayjs().year(year).month(monthIndex).startOf('month').unix();
    const endDate = dayjs().year(year).month(monthIndex).endOf('month').unix();
    const highlightedDates = Object.keys(submissionCalendar).filter(date => {
      return date >= startDate && date <= endDate;
    }).map(date => dayjs.unix(date).date());
    return highlightedDates;
  };

  return (
    <Card style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', overflow: 'auto' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
          <Typography variant="body2" style={{ flex: 1, marginBottom: isMobile ? 8 : 0 }}>
            235 submissions in the Past one year
          </Typography>
          <Typography variant="body2" style={{ marginRight: 16, flex: 1 }}>
            Total Active Days: {profileData?.matchedUser?.userCalendar?.totalActiveDays}
          </Typography>
          <Typography variant="body2" style={{ marginRight: 16, flex: 1 }}>
            Max Streak: {profileData?.matchedUser?.userCalendar?.streak}
          </Typography>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { padding: '8px' },
              border: 'none',
              minWidth: isMobile ? '100%' : 'auto'
            }}
          >
            {profileData?.matchedUser?.userCalendar?.activeYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={isMobile ? 'repeat(12, minmax(100px, 1fr))' : 'repeat(12, 1fr)'}
          gap={1}
          style={{
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            whiteSpace: 'nowrap'
          }}
          sx={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // Customize the color of the scrollbar thumb
              borderRadius: '10px',
              border: '2px solid transparent',
              backgroundClip: 'content-box'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1' // Customize the scrollbar track color
            }
          }}
        >
          {months.map((month, index) => (
            <Box key={index} textAlign="center" padding={1} style={{ overflow: 'hidden' }}>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gridTemplateRows="repeat(8, 1fr)"
                gap={0.5}
                style={{ height: '100px' }} // Adjust height as needed
              >
                {[...Array(30)].map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const isHighlighted = getHighlightedDates(month.month, month.year).includes(day);
                  
                  return (
                    <Box
                      key={dayIndex}
                      width={8}
                      height={8}
                      borderRadius="50%"
                      bgcolor={isHighlighted ? '#4CAF50' : '#e0e0e0'}
                      style={{
                        cursor: 'pointer',
                        display: 'inline-block',
                        boxShadow: isHighlighted ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
                      }}
                    />
                  );
                })}
              </Box>
              <Typography variant="body2" color="textSecondary">{month.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityStatsCard;
