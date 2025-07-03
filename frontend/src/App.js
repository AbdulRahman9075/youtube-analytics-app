import { BrowserRouter, Routes, Route,Navigate} from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Home from './components/pages/home.js';
import Subscriptions from './components/pages/subscriptions.js';
import NotFound from './components/pages/notfound.js';
import Logout from './components/pages/logout.js';
import Login from './components/pages/login.js';



function AppRoutes() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/logout"element={<Logout />}/>
        <Route path="/*" element={<NotFound/>}/>


      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
