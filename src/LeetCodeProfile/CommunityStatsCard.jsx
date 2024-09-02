import React from 'react';
import { Typography, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForumIcon from '@mui/icons-material/Forum';
import StarIcon from '@mui/icons-material/Star';

const CommunityStatsCard = ({community}) => {
  return (
    <Box>
      <Typography variant="h8">Community Stats</Typography>
      <Box marginBottom={2}>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <VisibilityIcon sx={{ marginRight: 1, color: '#1976d2', fontSize: 20 }} />
          <Box>
            <Typography variant="body2">
              <strong>Views:</strong> {community?.matchedUser?.profile?.postViewCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last week: {community?.matchedUser?.profile?.postViewCount}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <CheckCircleIcon sx={{ marginRight: 1, color: '#4caf50', fontSize: 20 }} />
          <Box>
            <Typography variant="body2">
              <strong>Solutions:</strong> {community?.matchedUser?.profile?.solutionCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last week: +{community?.matchedUser?.profile?.solutionCount}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <ForumIcon sx={{ marginRight: 1, color: '#f44336', fontSize: 20 }} />
          <Box>
            <Typography variant="body2">
              <strong>Discuss:</strong> {community?.matchedUser?.profile?.categoryDiscussCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last week: {community?.matchedUser?.profile?.categoryDiscussCount}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <StarIcon sx={{ marginRight: 1, color: '#ff9800', fontSize: 20 }} />
          <Box>
            <Typography variant="body2">
              <strong>Reputation:</strong> {community?.matchedUser?.profile?.reputation}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last week: {community?.matchedUser?.profile?.reputation}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityStatsCard;
