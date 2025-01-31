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


function Home() {
  const navigate = useNavigate();
  //control references
  const formRef = useRef(null);
  const textFieldRef = useRef(null)

  //regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const [existingUsers, setExistingUsers] = useState([]);
  const[userid,setUserId] = useState(null)

  const [emailValid,setEmailValid] = useState(true)
  const [passValid,setPassValid] = useState(true)

  const [emailTouched, setEmailTouched] = useState(false)
  const [pwdTouched, setPwdTouched] = useState(false)
  const [unameTouched, setUnameTouched] = useState(false)

  
  const [userExists, setUserExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

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
              const response =  await fetch('http://localhost:5000/users');
        
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
    {navigate('/profile')}
    /*else if(dlgParameters.sender === 'signin')
      {  navigate('/') }*/
    
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
      console.log('Signing up:', formData);
      // Call signup API
      if(!emailValid)
      {
        console.log("invalid email")
        setDlgParameters({title:'Validation Error',text:'The email provided is invalid, please input a proper email',sender: 'validate'})
        setIsDialogOpen(true)
        return;
      }
      if(!passValid)
      {
        console.log("invalid password")
        setDlgParameters({title:'Validation Error',text:'Password minimum length must be 8 and must be alphanumeric',sender: 'validate'})
        setIsDialogOpen(true)
        return;
      }
      if(userExists)
      {
        console.log("user exists")
        setDlgParameters({title:'Validation Error',text:'A member with the specified username exists',sender: 'validate'})
        setIsDialogOpen(true)
        return;
    }
    if(emailExists)
        {
          setDlgParameters({title:'Validation Error',text:'A member with the specified email exists',sender: 'validate'})
          setIsDialogOpen(true)
          return;
      }
      try {
        
        // Send the form data to the API
        const response = await fetch('http://localhost:5000/api/signup', {
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
        setDlgParameters({title:'Success',text:'An activation email has been sent to your email',sender: 'signup'})
        setIsDialogOpen(true)
        //alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error:', error);
        //alert('Failed to submit form.');
      }
    } else {
      console.log('Signing in:', formData);
      try {
        // Send the form data to the sign in API
        const response = await fetch('http://localhost:5000/authenticate', {
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
            setUserId(result.id);
            navigate('/home');
            
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