import { useEffect } from 'react';
import SimpleBackdrop from '../utils/backdrop.js';
import Constant from '../../assets/constants.js';

const Logout = () => {
  useEffect(() => {
    const logoutUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await fetch(Constant.backendDomain+'/api/logout', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem('token');
      window.location.href = '/'; // or your login page
    };

    logoutUser();
  }, []);

  return (
    <div>
      <SimpleBackdrop />
    </div>
  );
};

export default Logout;
