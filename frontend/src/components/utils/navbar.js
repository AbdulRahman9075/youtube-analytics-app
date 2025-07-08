import {Link } from 'react-router-dom';
import {useState} from 'react';
import {AppBar,Box,Toolbar,IconButton,Typography,Menu,Container,Avatar,Button,Tooltip,MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Constant from '../../assets/constants.js';
import { useUser } from '../../hooks/userContext.js';
import SimpleBackdrop from './backdrop.js';
import MyLogo from  '../../assets/logo-nobg.png' 


const pages = [
  { name: 'Home', path: '/home' },
  { name: 'Subscriptions', path: '/subscriptions' }
];
const settings = [
  { name: 'Logout', path: '/logout' }
];

function Navbar() {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { profilePhoto, loading } = useUser();
  if (loading){
    return <SimpleBackdrop/>;
  }
  
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={MyLogo}
            alt="App Logo"
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              height: 24, // adjust size as needed
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            //href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 'bolder',
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ANALYTICS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <Link to={`${page.path}`}>
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem></Link>

              ))}
            </Menu>
          </Box>
          {/* mobile devices name only, no logo */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            // href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ANALYTICS
          </Typography>
         
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link to={`${page.path}`}>
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button></Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{
                 p: 0,
                 backgroundColor: Constant.linkColor, 
                 '&:hover': {
                  backgroundColor: Constant.linkHoverColor, 
                 },
                 '&:active': {
                  backgroundColor: Constant.linkActiveColor, 
                 },
                 padding: 0.8
                 }}>
                <Avatar alt="App Logo" src={profilePhoto} /> {/*account image */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Link to={`${setting.path}`}>
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                </MenuItem></Link>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;