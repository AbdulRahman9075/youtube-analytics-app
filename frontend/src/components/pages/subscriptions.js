import useAbortableFetch from '../../hooks/useFetch.js';
import SimpleBackdrop from '../utils/backdrop.js';
import Error from '../utils/error.js';
import Navbar from '../utils/navbar.js';
import {Box,IconButton,Avatar,Paper,useMediaQuery, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Constant from '../../assets/constants.js';
import PieAnimation from '../charts/pieChart.js';
import { styled } from '@mui/material/styles';
function Subscriptions() {
  
  
  //Colours and Shared Styles

  //Hooks
  const isLargeScreen = useMediaQuery('(min-width: 1024px)'); //>1024
  //Body

  const { data, loading, error } = useAbortableFetch('/api/subscriptions');

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

  if (data.success){
    return <Error message={data.error.message} />
  }

  //PieChart
  const calculateCategoryCounts = (channelArray)=> {
    const categoryCounts = {};

    for (const channel of channelArray) {
      const category = channel.category;

      if (category in categoryCounts) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    }
    return categoryCounts;
  }

  const categoryCounts = calculateCategoryCounts(data);

  const normalize = (value, total) => Number.parseFloat(((value/total)*100).toFixed(2));
  

  const currentCategoryCounts = Object.entries(categoryCounts).map(([key, value]) => ({
    key,
    label: key === 'Uncategorized' ? 'Uncategorized' : key,
    value: normalize(value, data.length),
    color: Constant.CATEGORY_COLORMAP_LIGHT[key] || '#000000',
  }));



  //const valueFormatter = (item) => `${item.value} %`;

  const GraphItem = styled((props) => <Paper elevation={13} {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: isLargeScreen ? '50%' : '100%',
  marginLeft: isLargeScreen ? '25%' : '0',
  height: '100%',
  lineHeight: '100vh',
  padding: 5,
  }));

  // Table
  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    {
      field: 'profilephoto',
      headerName: 'Logo',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => window.open(params.row.link, '_blank')}
          sx={{
            p: 0,
            backgroundColor: Constant.linkColor, 
            '&:hover': {
            backgroundColor: Constant.linkHoverColor, 
            },
            '&:active': {
            backgroundColor: Constant.linkActiveColor, 
            },
            padding: 0.6,
          }}
        >
          <Avatar
            alt="Channel Logo"
            src={params.value}
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'title', headerName: 'Channel Title', width: 200 },
    {
      field: 'subscriberCount',
      headerName: 'Subscribers',
      width: 200,
      valueFormatter: ({ value }) => value?.toLocaleString(),
    },
    { field: 'country', headerName: 'Country', width: 200 },
    { field: 'category', headerName: 'Category', width: 200 },
  ];

  const rows = data.map((channel, index) => ({
    id: index + 1,
    profilephoto: channel.profilephoto,
    title: channel.title,
    subscriberCount: channel.subscriberCount,
    country: channel.country,
    category: channel.category,
    link: `https://www.youtube.com/${channel.customUrl}`,
  }));

  return (
    <div>
      <Navbar/>
      <Box 
        sx={{ 
        display: 'flex',
        width: '100%', 
        flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection:'column',
            width:'100%',
            padding: 2,
          }}
        >
          <GraphItem sx={{ flex: 1 }}>
            {/* <PieAnimation Data={currentCategoryCounts} Formatter={valueFormatter}/> */}
            <PieAnimation Data={currentCategoryCounts}/>

          </GraphItem>
        </Box>
      </Box>
      {data && Array.isArray(data) && (
      <Box sx={{ height: 'auto', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          disableMultipleRowSelection
          disableColumnResize
          hideFooterPagination
        />
      </Box>
    )}
    </div>
  );


}

export default Subscriptions;