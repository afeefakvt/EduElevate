import { Box, Typography, Button } from '@mui/material';
import bannerImage from '../../assets/banner.webp';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#FBEAEB',
        padding: { xs: '2rem 1rem', md: '4rem' },
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Section - Text */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: 'center', md: 'left' },
          maxWidth: '600px',
          paddingRight: { md: '2rem' },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            fontWeight: 'bold',
            color: '#2e2e2e',
            lineHeight: '1.2',
          }}
        >
          Master <span style={{ color: '#6A0DAD' }}>Code</span>,<br />
          From Industry Experts.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#555',
            margin: '1rem 0',
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Skip the "what should I learn next?" confusion. Follow our structured
          paths, build awesome projects, and get expert help whenever you need it.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#6A0DAD',
            color: 'white',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#550A8A',
            },
          }}
          onClick={() => navigate('/courses')}
        >
          Get Started
        </Button>
      </Box>

      {/* Right Section - Image */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: '1rem', md: '0' },
        }}
      >
        <img
          src={bannerImage}
          alt="Industry Experts Illustration"
          style={{
            maxWidth: '90%',
            height: 'auto',
            borderRadius: '12px',
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
};

export default Banner;