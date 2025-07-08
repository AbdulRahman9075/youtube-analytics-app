import { useEffect } from 'react';
import SimpleBackdrop from '../utils/backdrop.js';

const Logout = () => {
  useEffect(() => {
    const logoutUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await fetch('/api/logout', {
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
