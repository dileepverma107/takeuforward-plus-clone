import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Box, Pagination } from '@mui/material';

const RecentActivityContent = ({ recentAc, isDarkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  
  const submissions = recentAc?.recentAcSubmissionList;
  console.log('Recent Activity:', submissions);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedSubmissions = submissions?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const timestampConverter = (timestamp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const elapsedTime = currentTime - timestamp;
  
    const secondsInAnHour = 3600;
    const secondsInADay = 86400;
    const secondsInAMonth = 30 * secondsInADay;
    const secondsInAYear = 12 * secondsInAMonth;
  
    if (elapsedTime < secondsInADay) {
      const hours = Math.floor(elapsedTime / secondsInAnHour);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (elapsedTime <= secondsInAMonth) {
      const days = Math.floor(elapsedTime / secondsInADay);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (elapsedTime < secondsInAYear) {
      const months = Math.floor(elapsedTime / secondsInAMonth);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(elapsedTime / secondsInAYear);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };

  const darkModeStyles = {
    paper: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      color: isDarkMode ? '#ffffff' : 'inherit',
    },
    tableRow: {
      backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
      '&:nth-of-type(odd)': {
        backgroundColor: isDarkMode ? '#333333' : '#f9f9f9',
      },
      '&:hover': {
        backgroundColor: isDarkMode ? '#3f3f3f' : '#e6e6e6',
      },
    },
    tableCell: {
      color: isDarkMode ? '#ffffff' : 'inherit',
      borderBottom: isDarkMode ? '1px solid #444' : '1px solid rgba(224, 224, 224, 1)',
    },
    pagination: {
      '& .MuiPaginationItem-root': {
        color: isDarkMode ? '#ffffff' : 'inherit',
      },
    },
  };

  return (
    <>
      <TableContainer component={Paper} style={{ boxShadow: 'none', ...darkModeStyles.paper }}>
        <Table aria-label="recent activity table">
          <TableBody>
            {paginatedSubmissions?.map((submission, index) => (
              <TableRow
                key={index}
                component="a"
                href={submission.link}
                target="_blank"
                style={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  ...darkModeStyles.tableRow,
                }}
              >
                <TableCell component="th" scope="row" style={darkModeStyles.tableCell}>
                  {submission?.title}
                </TableCell>
                <TableCell align="right" style={darkModeStyles.tableCell}>
                  {timestampConverter(submission.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {submissions?.length > rowsPerPage && (
        <Box display="flex" justifyContent="center" marginTop={2}>
          <Pagination
            count={Math.ceil(submissions.length / rowsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            style={darkModeStyles.pagination}
          />
        </Box>
      )}
    </>
  );
};

export default RecentActivityContent;