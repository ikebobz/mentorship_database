import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef} from 'react';
import '../App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import logo from '../assets/haac_ico.png'
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BadgeIcon from '@mui/icons-material/Badge';
import SimpleBottomNavigation from '../components/SimpleNavigation';
import StyleIcon from '@mui/icons-material/Style';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import EmailIcon from '@mui/icons-material/Email';
import MultipleSelect from '../components/multiple';
import AlertDialog from '../components/alert';
import { useLocation } from 'react-router-dom';


const CustomTextField = styled(TextField)({
    width: '400px',
  });


function Profile()
{

const location = useLocation();

const navigate = useNavigate();
const countryCodes = [
    { code: '+1', label: 'USA (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+91', label: 'India (+91)' },
    { code: '+61', label: 'Australia (+61)' },
    // Add more country codes as needed
  ];
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('+1');
  const [countries,setCountries] = useState([])
  const [regions,setRegions] = useState([])
  const [cities,setCities] = useState([])
  const [certs,setCerts] = useState([])
  const [mentorStyle,setMentorStyles] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({})
  const [userId, setUserId] = useState('')

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    othername:'',
    email:'',
    mobile:'',
    country:'',
    region:'',
    city:'',
    address:'',
    certifications:'',
    mentorstyle:'',
  });

  const [dlgParameters, setDlgParameters] = useState({
      title: '',
      text: '',
      sender: ''
    }) ;


  const closeDialog = () => {
    setIsDialogOpen(false);
    if(dlgParameters.sender === 'form')
    {
      navigate('/home', {state: userId})
    
    }
    };
  

  
  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const formRef = useRef(null);

  //handle click of save button
  const handleClick = () => {
    if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    
  };

  //fire when each texfield is populated
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name == 'mobile')
    {
        const val = `${countryCode}${value}`
        setFormData({
            ...formData,
            mobile: val,
          });
          return

    }
     setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm())
    {
        setDlgParameters({title:'Error',text:'One or more mandatory field is missing',sender: 'error'})
        setIsDialogOpen(true)
        return;  
    }
    try {
        
        // Send the form data to the API
        console.log('authentication id: ',location)
        const updatedForm = {...formData, authid: location.state};
        console.log('Updated form is: ', updatedForm)
        setFormData(updatedForm)
        console.log('Formdata: ',formData)
        const response = await fetch('http://localhost:5000/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedForm),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Success:', result);
        if(result.message === 'Form submitted successfully!')
        {
        setUserId(result.id)
        setDlgParameters({title:'Success',text:'Form successfully submitted',sender: 'form'})
        setIsDialogOpen(true)
        }
        //alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error:', error);
        //alert('Failed to submit form.');
      }

  };

  //handle update from multiple select
  const handleMultipleSelect = (data) =>
  {
    console.log('received data: ',data)
    setFormData({
     ...formData,
     certifications: data,
    }
)
  };

  //validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First Name is required';
    }

    if (!formData.lastname.trim()) {
        newErrors.lastname = 'Last Name is required';
      }

      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile is required';
      }

      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.region.trim()) {
        newErrors.region = 'Region is required';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }

      if (!formData.mentorstyle.trim()) {
        newErrors.mentorstyle = 'Mentor mode is required';
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  

  //fetch parameters
  useEffect(() => {
  const getParameters = async () => {
    try {
        // Send the form data to the API
        const response =  await fetch('http://localhost:5000/parameters');
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Success:', result);
        setCountries(result.countries);
        setRegions(result.regions)
        setCities(result.cities)
        setCerts(result.certificates)
        setMentorStyles(result.mentorstyle)
        
        } 
        catch (error) {
        console.error('Error:', error);
        }
        finally{
          setLoading(false)
        }

  };
  getParameters();

  },[]);
  if(loading) return(<div>Loading.........</div>)



return (
    <div class = "profile">
        <div class = "imagecontainer">
        <img src = {logo} alt = "site-logo"/>
        </div>
        <div class = "stacks">
        <form ref = {formRef} onSubmit={handleSubmit}>
       <Stack direction = "row" spacing={5}>
       <Stack spacing = {5}>
        <label>Personal Details</label>
       <CustomTextField
         name = 'firstname'
          required
          id="outlined-required"
          label="First Name"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < PersonIcon/>
           </InputAdornment>
         ),
       },
     }}
          />
        <CustomTextField
          name = 'lastname'
          required
          id="outlined-required"
          label="Last Name"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < PersonIcon/>
           </InputAdornment>
         ),
       },
     }}
    />
    <CustomTextField
          name = 'othername'
          required
          id="outlined-required"
          label="Other name"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < PersonIcon/>
           </InputAdornment>
         ),
       },
     }}
    />
         <CustomTextField
          name = 'email'
          required
          id="outlined-required"
          label="Email"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < EmailIcon/>
           </InputAdornment>
         ),
       },
     }}
          
        />
        <CustomTextField
          name = 'mobile'
          required
          id="outlined-required"
          label="Contact"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < CallIcon/>
             <Select
              value={countryCode}
              onChange={handleCountryCodeChange}
               variant="standard"
              sx={{
                '& .MuiSelect-select': {
                  paddingRight: '8px', // Adjust padding for better appearance
                },
                '&:before, &:after': {
                  borderBottom: 'none', // Remove underline
                },
              }}
            >
              {countryCodes.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
           </InputAdornment>
         ),
       },
     }}
        />
       </Stack>
       <Stack spacing = {5}>
       <label>Geographical Details</label>
       <CustomTextField
          name = 'country'
          required
          id="outlined-required"
          label="Country"
          select
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < LocationCityIcon/>
           </InputAdornment>
         ),
       },
     }}
          >
            {countries.map((option) => (
            <MenuItem key={option.id} value={option.description}>
              {option.description}
            </MenuItem>
          ))}
          </CustomTextField>
        <CustomTextField
          name = 'region'
          required
          id="outlined-required"
          label="Region"
          select
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < LocationCityIcon/>
           </InputAdornment>
         ),
       },
     }}
        >
            {regions.map((option) => (
            <MenuItem key={option.id} value={option.description}>
              {option.description}
            </MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          name = 'city'
          required
          id="outlined-required"
          label="City"
          select
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < LocationCityIcon/>
           </InputAdornment>
         ),
       },
     }}
        >
      {cities.map((option) => (
            <MenuItem key={option.id} value={option.description}>
              {option.description}
            </MenuItem>
          ))}

        </CustomTextField>
        <CustomTextField
          required
          name = 'address'
          id="outlined-required"
          label="Street Address"
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < LocationCityIcon/>
           </InputAdornment>
         ),
       },
     }}
        />
        </Stack>
       
       <Stack spacing = {5}>
       <label>Membership Details</label>
        <CustomTextField
         name = 'mentorstyle'
         id="outlined-required"
          label="Membership Style"
          select
          onChange={handleChange}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < StyleIcon/>
           </InputAdornment>
         ),
       },
     }}
          >
        {mentorStyle.map((option) => (
            <MenuItem key={option.id} value={option.description}>
              {option.description}
            </MenuItem>
          ))}

          </CustomTextField>
          <MultipleSelect certs = {certs}  onUpdate = {handleMultipleSelect} />

       </Stack>
       </Stack>
       <div style = {{textAlign: 'center',marginTop: 10}}>
       <Button variant = "contained" color = "error" onClick={handleSubmit}>Save</Button>
       </div></form>
        </div>
      <center><SimpleBottomNavigation /></center>
      <AlertDialog isOpen={isDialogOpen} onClose={closeDialog} title = {dlgParameters.title} text = {dlgParameters.text} />
   </div>
);

}

export default Profile;
