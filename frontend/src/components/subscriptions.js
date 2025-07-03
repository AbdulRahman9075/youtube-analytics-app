import useAbortableFetch from '../hooks/useFetch';
import SimpleBackdrop from './backdrop.js';
import Error from './error.js';
import Navbar from './navbar.js';
import {Box,IconButton,Avatar} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Color from '../assets/colors.js';
function Subscriptions() {
  
  
  //Colours and Shared Styles

  //Hooks

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
            backgroundColor: Color.linkColor, 
            '&:hover': {
            backgroundColor: Color.linkHoverColor, 
            },
            '&:active': {
            backgroundColor: Color.linkActiveColor, 
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