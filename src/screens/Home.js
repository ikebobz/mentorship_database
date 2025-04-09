//import React from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton } from '@mui/material';
import bcrypt from 'bcryptjs';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility } from '@mui/icons-material';
import PageHeader from '../components/header';
import { useMediaQuery } from '@mui/material';



function Home() {
  const apiUrl = process.env.REACT_APP_API_URL
  const isMobile = useMediaQuery('(max-width:767px)');
  const navigate = useNavigate();
  //control references
  const formRef = useRef(null);
  const textFieldRef = useRef(null)

  //regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const [existingUsers, setExistingUsers] = useState([]);
  const[showProgress,setShowProgress] = useState(false)


  const [emailValid,setEmailValid] = useState(true)
  const [passValid,setPassValid] = useState(true)

  const [emailTouched, setEmailTouched] = useState(false)
  const [pwdTouched, setPwdTouched] = useState(false)
  const [unameTouched, setUnameTouched] = useState(false)

  
  const [userExists, setUserExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [authid, setAuthId] = useState(null)
  const [profileid, setProfileId] = useState(null)


  const [dlgParameters, setDlgParameters] = useState({
    title: '',
    text: '',
    sender: ''
  }) 
  //fetch all user credentials
  useEffect(() => {
    const getAllUsers = async () => 
        {
          try {
              // Send the form data to the API
              const response =  await fetch(`${apiUrl}/users`);
        
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
        
              const result = await response.json();
              const data = result.existingUsers;
              console.log('Success:', data);
              setExistingUsers(data);
              
              } 
              catch (error) {
              console.error('Error:', error);
              }
              finally{
                
              }
        };
        getAllUsers();
  }, []);

  useEffect(() => {
    console.log(existingUsers);
  },[existingUsers]);
  

  const handleClick = () => {
    if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    
  };
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => {
    setIsDialogOpen(false);
    if(dlgParameters.sender === 'signup')
    {
      console.log('navigating to profile with auth id: ',authid)
      navigate('/profile', {state: authid})
    }
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashed = bcrypt.hashSync(formData.password,10);
        const data = {
            email: formData.email,
            username: formData.username,
            password: hashed
        }
    if (isSignUp) {
      if (!formData.username.trim() && isSignUp) {
        setShowProgress(false);
        setDlgParameters({ title: 'Validation Error', text: 'Username cannot be blank', sender: 'validate' });
        setIsDialogOpen(true);
        return;
      }

      if (!formData.email.trim()) {
        setShowProgress(false);
        setDlgParameters({ title: 'Validation Error', text: 'Email cannot be blank', sender: 'validate' });
        setIsDialogOpen(true);
        return;
      }

      if (!formData.password.trim()) {
        setShowProgress(false);
        setDlgParameters({ title: 'Validation Error', text: 'Password cannot be blank', sender: 'validate' });
        setIsDialogOpen(true);
        return;
      }
      setShowProgress(true)
      console.log('Signing up:', formData);
      // Call signup API
      if(!emailValid)
      {
        console.log("invalid email")
        setShowProgress(false)
        setDlgParameters({title:'Validation Error',text:'The email provided is invalid, please input a proper email',sender: 'validate'})
        setIsDialogOpen(true)
        return;
      }
      if(!passValid)
      {
        console.log("invalid password")
        setShowProgress(false)
        setDlgParameters({title:'Validation Error',text:'Password minimum length must be 8 and must be alphanumeric',sender: 'validate'})
        setIsDialogOpen(true)
        return;
      }
      if(userExists)
      {
        console.log("user exists")
        setShowProgress(false)
        setDlgParameters({title:'Validation Error',text:'A member with the specified username exists',sender: 'validate'})
        setIsDialogOpen(true)
        return;
    }
    if(emailExists)
        {
          setShowProgress(false)
          setDlgParameters({title:'Validation Error',text:'A member with the specified email exists',sender: 'validate'})
          setIsDialogOpen(true)
          return;
      }
      try {
        
        // Send the form data to the API
        const response = await fetch(`${apiUrl}/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Success:', result);
        setAuthId(result.id)
        setDlgParameters({title:'Success',text:'Signup successfully completed!',sender: 'signup'})
        setIsDialogOpen(true)
        
      } catch (error) {
        console.error('Error:', error);
        //alert('Failed to submit form.');
      }
    } else {
      if (!formData.email.trim()) {
        setShowProgress(false);
        setDlgParameters({ title: 'Validation Error', text: 'Email cannot be blank', sender: 'validate' });
        setIsDialogOpen(true);
        return;
      }

      if (!formData.password.trim()) {
        setShowProgress(false);
        setDlgParameters({ title: 'Validation Error', text: 'Password cannot be blank', sender: 'validate' });
        setIsDialogOpen(true);
        return;
      }
      console.log('Signing in:', formData);
      try {
        // Send the form data to the sign in API
        const response = await fetch(`${apiUrl}/authenticate`, {
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
        if(result.message === "Authentication successful")
        {
            setProfileId(result.profileid);
            if(result.profileid > 0)
            navigate('/home', {state: result.profileid});
           else navigate('/profile')
            
        }
        else if(result.code === 2)
        {
          setDlgParameters({title:'Notice',text:'User with email address does not exist!',sender: 'signin'})
          setIsDialogOpen(true)  
        }
        else
        {
            setDlgParameters({title:'Notice',text:'Invalid email and password combination',sender: 'signin'})
            setIsDialogOpen(true)  
        }
        
      } catch (error) {
        console.error('Error:', error);
        
      }

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
        const exists = existingUsers.some((item) => item['email'] === value);
        setEmailExists(exists)
    }
    else if(name === 'password')
    {
        setPwdTouched(true)
        setPassValid(passwordRegex.test(value))
    }
    else if(name === 'username')
    {
        setUnameTouched(true)
        const exists = existingUsers.some((item) => item['username'] === value);
        setUserExists(exists)
    }
    };


   // const isMobile = window.innerWidth <= 768;

    const formStyles = {
      '& .MuiTextFieldRoot': { 
        m: 1, 
        width: isMobile ? '90%' : '35ch' 
      },
    };

    const headerStyles = {
      fontSize: isMobile ? '1.5rem' : '2rem',
    };

    const buttonStyles = {
      width: isMobile ? '90%' : 'auto',
      margin: isMobile ? '10px auto' : '10px',
    };
  return (
    <div className="App" style = {{ padding: '16px' }}>
      <div className="imagecontainer" style={{ textAlign: 'center' }}>
	   
            <img src={logo} alt="site-logo" />
          </div>
          <div className="page-header-container">
          <PageHeader />
          </div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form ref = {formRef} onSubmit={handleSubmit} style = {formStyles}>
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
              error = {userExists ? true : false}
			  label = "Username"
              helperText= {userExists ? 'Username has been taken' : 'Provide a username'}
              variant = 'standard'
			  fullWidth
              onBlur={handleBlur}
			  slotProps={{
               input: {
               startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            endAdornment: (
                <InputAdornment position="end">
                  {!userExists && unameTouched && formData.username != '' && (
                    <IconButton disabled>
                      <CheckCircleIcon style={{ color: 'green' }} /> {/* Green tick */}
                    </IconButton>
                  )}
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
            error = {isSignUp ? ((!emailValid && emailTouched) || emailExists ? true : false) : false}
            helperText = {isSignUp ? (!emailValid && emailTouched ? 'Email not valid' : (emailExists ? 'Email already exists' : 'Please provide a valid email')) : 'Provide your email'}
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
        <Button variant = "contained" color = "error"  onClick={handleClick} style = {buttonStyles}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
		</Box>
      </form>
      <p>
        {isSignUp ? 'Already have an account? ' : 'Need an account? '}
        <Button variant = "contained" color = "error" onClick={() => setIsSignUp(!isSignUp)} style = {buttonStyles}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </p>
      <p style = {{visibility: showProgress ? 'visible' : 'hidden'}}><CircularProgress /></p>
      <AlertDialog isOpen={isDialogOpen} onClose={closeDialog} title = {dlgParameters.title} text = {dlgParameters.text} />
    </div>
  );
}

export default Home;