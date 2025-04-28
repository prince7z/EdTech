import React from 'react';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';


function Menu() {
    return (
    <>


<div className="menu-icons"
style={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '80vh',
  padding:'5px',
  
  width: '20px',
  backgroundColor: '#f5f5f5',
}}>
  <IconButton onClick={() => console.log('Home clicked')}>
    <HomeIcon />
  </IconButton>
  <IconButton onClick={() => console.log('User clicked')}>
    <PersonIcon />
  </IconButton>
  <IconButton onClick={() => console.log('Settings clicked')}>
    <SettingsIcon />
  </IconButton>
  <IconButton onClick={() => console.log('Notifications clicked')}>
    <NotificationsIcon />
  </IconButton>
  <IconButton onClick={() => console.log('Messages clicked')}>
    <EmailIcon />
  </IconButton>
  <IconButton onClick={() => console.log('Logout clicked')}>
    <LogoutIcon />
  </IconButton>
</div>
    </>
    )

}
export default Menu;