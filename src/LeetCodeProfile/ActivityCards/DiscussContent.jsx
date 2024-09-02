import { Typography, Box } from '@mui/material';
import Diagonal3DText from '../../Diagonal3DText';

const DiscussContent = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%" // Ensure the Box takes full height of the parent
    >
      <Typography component="div">
        <Diagonal3DText />
      </Typography>
      <Typography variant="body1" align="center" marginTop={2}>
        No Discussions
      </Typography>
    </Box>
  );
};

export default DiscussContent;
