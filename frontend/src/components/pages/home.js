import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import useAbortableFetch from '../../hooks/useFetch.js';
import SimpleBackdrop from '../utils/backdrop.js';
import Navbar from '../utils/navbar.js';
import Error from '../utils/error.js';
import {Paper,Box,useMediaQuery, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import MultiLineChart from '../charts/multiLineChart.js';
import SingleLineChart from '../charts/singleLineChart.js';



function Home() {
  //Colours and Shared Styles
  const itemBgColor = '#115ca0';
  const itemTitleColor = '#cfdeec';
  const itemTextColor = '#cfdeec';
  
  const titleTypographySx = {
  height: '20%',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  fontFamily: 'Roboto, sans-serif',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'flex-start',
};

const valueTypographySx = {
  width: '100%',
  height: '80%',
  fontWeight: 'bolder',
  fontSize: '1.8rem',
  fontFamily: 'Roboto, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};


  //Hooks
  const isLandscape = useMediaQuery('(min-width: 560px)'); // >560
  const isSmallScreen = useMediaQuery('(max-width: 560px)'); //<560
  const isLargeScreen = useMediaQuery('(min-width: 1024px)'); //>1024

  //Body
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Clean the URL by navigating to /home without query
      navigate('/home', { replace: true });
    }
  }, [navigate]);


  const { data, loading, error } = useAbortableFetch('/api/home');

  if (loading){ 
      return (
        <div>
          <SimpleBackdrop/>
        </div>
      );
    }
  if (error){
    return <Error message={error} />
  };

  if (data && data.success === false){
    return <Error message={data.error.message} />
  }

  const Item = styled((props) => (
    <Paper elevation={13} {...props} />
  ))(({ theme, bgcolor = itemBgColor }) => ({
    ...theme.typography.body2,
    backgroundColor: bgcolor,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: theme.spacing(1.5),
    gap: 5
  }));


  const GraphItem = styled((props) => <Paper elevation={13} {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%',
  height: '100%',
  lineHeight: '45vh',
  padding: 5
  }));


  return (
    <>
    <div>
      
      <Navbar/>
        <Box>  

          <Box
              sx={{
                display: 'flex',
                justifyContent: isLandscape ? 'center' : 'flex-start',
                width: '100%',
                padding: 3,
              }}
            >
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                width: isLandscape ? '60vw' : '100%',
                maxWidth: isLargeScreen ? '40vw' : '100%',
              }}
            >
            <Item sx={{ flex: 1 }}>
              {/* Title Typography */}
              <Typography
                sx={{
                  ...titleTypographySx,
                  color: itemTitleColor,
                }}
              >
                Total Subscriptions
              </Typography>

              {/* Value Typography */}
              <Typography
                sx={{
                  ...valueTypographySx,
                  color: itemTextColor,
                }}
              >
                {data?.[data.length - 1]?.totalSubscriptions ?? '-'}
              </Typography>
            </Item>
            <Item sx={{ flex: 1 }}>
              {/* Title Typography */}
              <Typography
                sx={{
                  ...titleTypographySx,
                  color: itemTitleColor,
                }}
              >
                Top Category
              </Typography>

              {/* Value Typography */}
              <Typography
                sx={{
                  ...valueTypographySx,
                  color: itemTextColor,
                }}
              >
                {data?.[data.length - 1]?.topCategory ?? '-'}
              </Typography>
            </Item>


            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            width: '100%', 
            flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection:'column',
                width: '100%',
                marginLeft: 0,
                padding: 3,
                gap: 5,
              }}
            >
              <GraphItem sx={{ flex: 1 }}>
                <MultiLineChart data={data}/>
              </GraphItem>
              <GraphItem sx={{ flex: 1 }}>
                <SingleLineChart data={data}/>
              </GraphItem>
            </Box>
          </Box>

          
        </Box>
      
    </div>
    {/* )} */}
  </>
  );
  
}

export default Home;
