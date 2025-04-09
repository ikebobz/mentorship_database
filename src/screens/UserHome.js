import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material';
import SimpleBottomNavigation from '../components/SimpleNavigation';
import logo from '../assets/haac_ico.png';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BadgeIcon from '@mui/icons-material/Badge';
import StyleIcon from '@mui/icons-material/Style';
import EmailIcon from '@mui/icons-material/Email';
import PageHeader from '../components/header';
import '../css/home.css';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';

const UserHome = () => {
  // Sample user data
  const apiUrl = process.env.REACT_APP_API_URL;
  const isMobile = useMediaQuery('(max-width:767px)');

  const [profileId, setProfileId] = useState('');
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState([]);
  const [data, setData] = useState({
    firstname: '',
    email: '',
    lastname: '',
    othername: '',
    mobile: '',
    address: '',
    certs: '',
    mentortype: '',
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

  const populateForm = () => {
    userData[0].text = `${data.firstname} ${data.lastname}`;
    userData[1].text = data.email;
    userData[2].text = data.mobile;
    userData[3].text = data.address;
    userData[4].text = data.certs;
    userData[5].text = data.mentortype;
  };

  useEffect(() => {
    console.log('profile id is: ', location.state);
    const getUserInfo = async () => {
      try {
        // Send the form data to the API
        const cachedData = localStorage.getItem('cachedData');

        if (cachedData && !location.state) {
          setData(JSON.parse(cachedData));
          setLoading(false);
        } else {
          console.log(`${apiUrl}/userinfo/${location.state}`);
          const response = await fetch(`${apiUrl}/userinfo/${location.state}`);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          console.log('Success:', result);
          setData(result.info);
          localStorage.setItem('cachedData', JSON.stringify(result.info));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    getUserInfo();
  }, [populateForm()]);

  if (loading) {
    return <div>loading........</div>;
  }
  console.log('userdata is:', userData);
  console.log('isMobile:', isMobile);

  return (
    <div style={{ padding: '16px' }}>
      <div className="imagecontainer" style={{ textAlign: 'center' }}>
        <img src={logo} alt="site-logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <div className="page-header-container" style={{ marginTop: '16px' }}>
        <PageHeader />
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Avatar
          alt="User Profile"
          src="https://via.placeholder.com/150"
          sx={{ width: 80, height: 80, margin: 'auto' }}
        />
        <h2 style={{ fontSize: '1.5rem', margin: '8px 0' }}>{`${data.certs.split('; ')[0]}.,`}</h2>
        <p style={{ fontSize: '1rem', color: '#666' }}>{`${data.membertype}`}</p>
      </div>
      <Card sx={{ maxWidth: isMobile ? '100%' : '800px', margin: '16px auto', padding: '16px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <CardContent>
          {userData.map((row, index) => (
            <Grid container alignItems="center" spacing={2} key={index} sx={{ marginBottom: 2 }}>
              <Grid item xs={2} style={{ textAlign: 'center' }}>
                {row.icon}
              </Grid>
              <Grid item xs={10} style={{ wordBreak: 'break-word' }}>
                <Typography variant="body1" style={{ fontSize: '0.9rem' }}>{row.text}</Typography>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>
    <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <SimpleBottomNavigation />
    </div>
      
    </div>
  );
};

export default UserHome;