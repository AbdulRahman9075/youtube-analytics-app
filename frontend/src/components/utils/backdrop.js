import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function SimpleBackdrop() {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
//   const handleOpen = () => {
//     setOpen(true);
//   };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
