import React from 'react';
import { useLocation } from 'react-router-dom';
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
import { useEffect, useState} from 'react';
import EmailIcon from '@mui/icons-material/Email';





const UserHome = () => {
  // Sample user data

  const [profileId, setProfileId] = useState('');
  const [loading, setLoading] = useState(true);
  const [certs,setCerts] = useState([])
  const [data, setData] = useState({
    firstname:  "",
    email:  "",
    lastname:  "",
    othername:  "",
    mobile:  "",
    address:  "",
    certs:  "",
    mentortype:  ""
  });
  
  
  const location = useLocation();

  const userData = [
    {
      icon: <PersonIcon fontSize="medium" color="black" />,
      text: 'Helen Excelsor',
    },
    {
      icon: <EmailIcon fontSize="medium" color="black" />,
      text: 'yelena@gmail.com',
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

  const populateForm = () =>
  {
    userData[0].text = `${data.firstname} ${data.lastname}`
    userData[1].text = data.email
    userData[2].text = data.mobile
    userData[3].text = data.address
    userData[4].text = data.certs
    userData[5].text = data.mentortype
    //setCerts(data.certs.split('; '))
  }


  useEffect(() => {
    
    console.log('profile id is: ',location.state)
    const getUserInfo = async () => {
      try {
          // Send the form data to the API
          const cachedData = localStorage.getItem('cachedData')

          if(cachedData && !location.state)
          {
            setData(JSON.parse(cachedData));
             setLoading(false);
          }
          else {
          console.log(`http://localhost:5000/userinfo/${location.state}`)
          const response =  await fetch(`http://localhost:5000/userinfo/${location.state}`);
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const result = await response.json();
          console.log('Success:', result);
          setData(result.info);
          localStorage.setItem('cachedData',JSON.stringify(result.info))
        }

                    
          } 
          catch (error) {
          console.error('Error:', error);
          }
          finally{
            setLoading(false);
          }
  
    };
    getUserInfo();
  
    },[populateForm()]);

    if(loading)
    {
      return (<div>loading........</div>)
    }
    console.log('userdata is:',userData)


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
      <h2>{`${data.profession}.,`}</h2>
      <p>{`${data.membertype}`}</p>
    </div>
    <Card sx={{ maxWidth: 800, margin: 'auto', marginTop: 4 }}>
      <CardContent>
        
        {userData.map((row, index) => (
          <Grid container alignItems="center" spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item>{row.icon}</Grid>
            <Grid item wordBreak = {'break-word'} maxWidth={'90%'}>
            <Typography variant="body1" >{row.text}</Typography>
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