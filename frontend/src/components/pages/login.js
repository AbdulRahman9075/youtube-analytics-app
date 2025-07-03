import { Box, IconButton,Typography } from '@mui/material';
import MyLogo from '../../assets/logo-nobg.png';     
import Googlelogo from '../../assets/googleicon.png';  
import Color from '../../assets/colors.js';

const Login = () => {
  const redirectToOauth = () => {
    window.location.href = 'http://localhost:8080/api/';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>

      {/* Logo */}
      <Box
        component="img"
        src={MyLogo}
        alt="My Logo"
        sx={{
          display: 'block',
          margin: '0 auto',
          height: 65,
          mb: 2,
        }}
      />
      <Typography
            variant="h6"
            noWrap
            component="a"
            //href="#app-bar-with-responsive-menu"
            sx={{
              mb: 2,
              display:'block',
              fontFamily: 'monospace',
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ANALYTICS
      </Typography>
      {/* Google Login Button */}
      <IconButton
        size="large"
        onClick={redirectToOauth}
        aria-label="Redirect to Google Login"
        sx={{
          mt: 20,
          color: 'inherit',
          backgroundColor: Color.linkColor, 
          '&:hover': {
          backgroundColor: Color.linkHoverColor, 
          },
          '&:active': {
          backgroundColor: Color.linkActiveColor, 
          },
        }}
      >
        <Box
          component="img"
          src={Googlelogo}
          alt="Google Logo"
          sx={{
            height: 50,

          }}
           
        />
      </IconButton>
    </div>
  );
};

export default Login;

