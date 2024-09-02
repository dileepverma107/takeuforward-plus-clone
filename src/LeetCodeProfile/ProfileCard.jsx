import { Card, CardContent, Typography, Avatar, Box, Divider } from '@mui/material';
import InputAndButtonSection  from './InputAndButtonSection'; // import the InputAndButtonSection component
import CommunityStatsCard from './CommunityStatsCard';
import ProblemSolvingStatsCard from './ProblemSolvingStatsCard';
import { useTheme} from '@mui/material/styles';

const ProfileCard = ({ onFetchData, profileData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Card style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar
            alt="User Avatar"
            src={profileData?.matchedUser?.profile?.userAvatar}
            style={{ width: 80, height: 80, marginRight: 16, borderRadius: 12 }}
          />
          <Box>
            <Typography variant="h5" style={{ fontSize: '1rem' }}>
            {profileData?.matchedUser?.username}
            </Typography>
            <Typography variant="body2">Rank: {profileData?.matchedUser?.profile?.ranking}</Typography>
          </Box>
        </Box>
        <Divider style={{ margin: '20px 0' }} />
        <InputAndButtonSection onSearch={onFetchData}/>

        <Divider style={{ margin: '20px 0' }} />
        <CommunityStatsCard community = {profileData}/>
        
        <Divider style={{ margin: '20px 0' }} />
        <ProblemSolvingStatsCard problemsData={profileData} isDarkMode={isDarkMode}/>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
