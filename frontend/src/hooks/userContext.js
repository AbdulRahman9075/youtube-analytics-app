import { createContext, useState, useEffect, useContext } from 'react';
import Constant from '../assets/constants.js';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(Constant.backendDomain+'/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (data.profilePhoto) {
          setProfilePhoto(data.profilePhoto);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ profilePhoto, loading }}>
      {children}
    </UserContext.Provider>
  );
};
