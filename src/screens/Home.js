//import React from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import logo from '../assets/haac_ico.png'

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile'); // Navigate to the About screen
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Signing up:', formData);
      // Call signup API
    } else {
      console.log('Signing in:', formData);
      // Call signin API
    }
  };

  return (
    <div className="App">
	  <img src = {logo} alt = "site-logo"/>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
	   <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
      noValidate
      autoComplete="off"
    >
        {isSignUp && (
          <div>            
            <TextField
              id="standard-helperText"
			  label = "Username"
              helperText="Provide a valid username"
              variant="standard"
			  fullWidth
			  slotProps={{
               input: {
               startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          },
        }}
              value={formData.username}
              onChange={handleChange}
			  required
            />
          </div> 
        )}
        <div>          
          <TextField
            id="standard-helperText"
			label = "Email"
            helperText="Provide a valid email"
            variant="standard"
			fullWidth
			 slotProps={{
               input: {
               startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          },
        }}
            value={formData.email}
            onChange={handleChange}
            required
			
          />
        </div>
        <div>
          <TextField
		    id="standard-password-input"
			label = "Password"
            helperText ="Specify Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
			fullWidth
			 slotProps={{
               input: {
               startAdornment: (
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            ),
          },
        }}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button variant = "contained" color = "error" >{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
		</Box>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : 'Need an account? '}
        <Button variant = "contained" color = "error" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </p>
    </div>
  );
}

export default Home;