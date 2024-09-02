import React, { useState } from 'react';
import { Card, CardContent, Box } from '@mui/material';
import RecentActivityNavbar from './RecentActivityNavbar';
import RecentActivityContent from './ActivityCards/RecentActivityContent';
import ListContent from './ActivityCards/ListContent';
import SolutionsContent from './ActivityCards/SolutionsContent';
import DiscussContent from './ActivityCards/DiscussContent';

const ActivityCard = ({profileData, isDarkMode}) => {
  const [selectedContent, setSelectedContent] = useState('recent');

  const renderContent = () => {
    switch (selectedContent) {
      case 'list':
        return <ListContent />;
      case 'solutions':
        return <SolutionsContent />;
      case 'discuss':
        return <DiscussContent />;
      default:
        return <RecentActivityContent recentAc={profileData} isDarkMode={isDarkMode}/>;
    }
  };

  return (
    <Card style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <RecentActivityNavbar onSelect={setSelectedContent} isDarkMode={isDarkMode}/>
      <CardContent>
        <Box>{renderContent()}</Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
