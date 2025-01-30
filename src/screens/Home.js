//import React from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import '../App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import logo from '../assets/haac_ico.png'
import CryptoJS from 'crypto-js';
import AlertDialog from '../components/alert';

function Home() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const textFieldRef = useRef(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const [emailValid,setEmailValid] = useState(true)
  const [passValid,setPassValid] = useState(true)

  const [emailTouched, setEmailTouched] = useState(false)
  const [pwdTouched, setPwdTouched] = useState(false)

  const [dlgParameters, setDlgParameters] = useState({
    title: '',
    text: '',
    sender: ''
  }) 
  

  const handleClick = () => {
    /*if(!isSignUp)
    {
    navigate('/profile'); // Navigate to the About screen
    }*/
    if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
  };
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => {
    setIsDialogOpen(false);
    if(dlgParameters.sender === 'signup')
    {navigate('/profile')}
    //else if (dlgParameters.sender === 'valdate')
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
      [name]: name === 'password' ? CryptoJS.AES.encrypt(value, 'mentor').toString() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Signing up:', formData);
      // Call signup API
      if(!emailValid)
      {
        setDlgParameters({text:'Validation Error',text:'The email provided is invalid, please input a proper email',sender: 'validate'})
        setIsDialogOpen(true)
      }
      if(!passValid)
      {
        setDlgParameters({text:'Validation Error',text:'Password minimum length must be 8 and must be alphanumeric',sender: 'validate'})
        setIsDialogOpen(true)
      }
      try {
        // Send the form data to the API
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Success:', result);
        setDlgParameters({text:'Success',text:'An activation email has been sent to your email',sender: 'signup'})
        setIsDialogOpen(true)
        //alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error:', error);
        //alert('Failed to submit form.');
      }
    } else {
      console.log('Signing in:', formData);
      // Call signin API
    }
  };

  const handleBlur = (e) => {
    //console.log('onblur called')
    const { name, value } = e.target;
    if(name === 'email')
    {
    
        setEmailTouched(true); // Mark the field as touched
        setEmailValid(emailRegex.test(value)); // Validate the email on blur
    }
    else if(name === 'password')
    {
        setPwdTouched(true)
        setPassValid(passwordRegex.test(value))
    }
    };

  return (
    <div className="App">
	  <img src = {logo} alt = "site-logo"/>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form ref = {formRef} onSubmit={handleSubmit}>
	   <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
      noValidate
      autoComplete="off"
    >
        {isSignUp && (
          <div>            
            <TextField
              name = 'username'
              id="standard-helperText"
			  label = "Username"
              helperText="Provide a valid username"
              variant = 'standard'
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
              value = {formData.username}
              onChange={handleChange}
			  required
            />
          </div> 
        )}
        <div>          
          <TextField
            name='email'
            inputRef = {textFieldRef}
            id="standard-helperText"
			label = "Email"
            error = {isSignUp ? (!emailValid && emailTouched ? true : false) : false}
            helperText = {isSignUp ? (!emailValid && emailTouched ? 'Email not valid' : 'Please provide a valid email') : 'Provide your email'}
            variant="standard"
			fullWidth
            onBlur={handleBlur}
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
            name = 'password'
		    id="standard-password-input"
			label = "Password"
            error = {isSignUp ? (!passValid && pwdTouched ? true : false) : false}
            helperText = {isSignUp ? (!passValid && pwdTouched ? 'Invalid password attribute' : 'Password must be a combination of letters and numbers') : 'Provide your login password'}
            type="password"
            variant="standard"
			fullWidth
            onBlur={handleBlur}
			 slotProps={{
               input: {
               startAdornment: (
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            ),
          },
        }}
        //value={formData.password}
        onChange={handleChange}
        //error = {passValid ? false : true}
        //helperText = {passValid ? 'Password must be a combination of letters and numbers' : 'Invalid password'}
        required
          />
        </div>
        <Button variant = "contained" color = "error"  onClick={handleClick}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
		</Box>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : 'Need an account? '}
        <Button variant = "contained" color = "error" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </p>
      <AlertDialog isOpen={isDialogOpen} onClose={closeDialog} title = {dlgParameters.title} text = {dlgParameters.text} />
    </div>
  );
}

export default Home;