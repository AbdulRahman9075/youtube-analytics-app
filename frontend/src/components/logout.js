import { useEffect } from 'react';
import SimpleBackdrop from './backdrop.js';


const Logout = () => {
  useEffect(() => {
    // This triggers a full browser redirect to backend flow
    window.location.href = 'http://localhost:8080/api/logout';
  }, []);

  return (
  <div>
    <SimpleBackdrop/>
  </div>
  );
};

export default Logout;