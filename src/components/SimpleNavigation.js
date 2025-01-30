import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import UpdateIcon from '@mui/icons-material/Update';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';



export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();


  

  return (
    <Box sx={{ width: 500, bottom: 50, position: 'fixed', left: '50%', transform: 'translateX(-50%)' }}>
      <BottomNavigation 
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              navigate('/profile');
              break;
            case 1:
              navigate('/');
              break;
            case 2:
              navigate('/home');
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="Edit Profile" icon={<UpdateIcon />} />
        <BottomNavigationAction label="Log Out" icon={<LogoutIcon />} />
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      </BottomNavigation>
    </Box>
  );
}
