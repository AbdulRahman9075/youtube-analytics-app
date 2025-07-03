import {Box,Button,Typography} from '@mui/material';
import Navbar from "../utils/navbar.js";
import { Link } from 'react-router-dom';

function NotFound() {

  return (
    <div>
        <Navbar/>
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10, // space between Typography and Button
          }}
        >
          <Typography 
            variant="h4"
            noWrap
            sx={{
              display: 'flex',
              fontFamily: 'Roboto',
              fontWeight: 'bolder',
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Page Not Found
          </Typography>

          <Button
            variant="contained"
            component={Link}
            to="/home"
            sx={{
              display: 'flex',
              fontFamily: 'Roboto',
              fontWeight: 500,
              letterSpacing: '.1rem',
              backgroundColor: '#efbac5', 
              '&:hover': {
                backgroundColor: '#eaa3b2', 
              },
              '&:active': {
                backgroundColor: '#e0758c', 
              },
              textDecoration: 'none',
              width: 'auto', // prevent full width
            }}
          >
            Back to Home
          </Button>
        </Box>
    </div>
  );
}

export default NotFound;
