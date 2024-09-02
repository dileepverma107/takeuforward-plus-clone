import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  height: '100%',
  position: 'relative',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    minHeight: '300px',
  },
}));

const Section = styled(Box)({
  width: '100%',
});

const BadgeImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '60px',
  },
}));

const BadgesCard = ({profileData}) => {
  const badgeName = profileData?.matchedUser?.badges[0]?.displayName 
  ? profileData.matchedUser.badges[0]?.displayName 
  : "No Badges";
  return (
    <StyledCard>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Section>
          <Typography variant="h10">Badges</Typography>
          <Typography>{profileData?.matchedUser?.badges.length}</Typography>
        </Section>
        
        <Section sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <BadgeImage src={profileData?.matchedUser?.badges[0]?.icon} alt="50 Days Badge 2024" />
        </Section>
        
        <Section>
          <Typography variant="h10">Most Recent Badge</Typography>
          <Typography>{badgeName}</Typography>
        </Section>
      </CardContent>
    </StyledCard>
  );
};

export default BadgesCard;