import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';
import SimpleBottomNavigation from '../components/SimpleNavigation';
import logo from '../assets/haac_ico.png'
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BadgeIcon from '@mui/icons-material/Badge';
import StyleIcon from '@mui/icons-material/Style';
import '../css/home.css'



const UserHome = () => {
  // Sample user data
  const userData = [
    {
      icon: <PersonIcon fontSize="medium" color="black" />,
      text: 'Helen Excelsor',
    },
    {
      icon: <CallIcon fontSize="medium" color="black" />,
      text: '+1-231-121-345',
    },
    {
      icon: <LocationCityIcon fontSize="medium" color="black" />,
      text: 'New York, USA',
    },
    {
        icon: <BadgeIcon fontSize="medium" color="black" />,
        text: 'ITA, CIST, MLST',
    },
    {
        icon: <StyleIcon fontSize="medium" color="black" />,
        text: 'Virtual',
    },

  ];

  return (
    <div>
        <div class = "imagecontainer">
        <img src = {logo} alt = "site-logo"/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
      <center><Avatar
        alt="User Profile"
        src="https://via.placeholder.com/150"
        sx={{ width: 100, height: 100 }}
      /></center>
      <h2>Helen E.,</h2>
      <p>Clinical Consultant</p>
    </div>
    <Card sx={{ maxWidth: 400, margin: 'auto', marginTop: 4 }}>
      <CardContent>
        
        {userData.map((row, index) => (
          <Grid container alignItems="center" spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item>{row.icon}</Grid>
            <Grid item>
              <Typography variant="body1">{row.text}</Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
    
    <center><SimpleBottomNavigation></SimpleBottomNavigation></center>
    </div>
  );
};

export default UserHome;