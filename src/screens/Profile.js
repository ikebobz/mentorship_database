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
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WorkIcon from '@mui/icons-material/Work';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import PageHeader from '../components/header'
import CustomInput from '../components/custominput';
import '../css/home.css';

const CustomTextField = styled(TextField)({
    width: '400px',
  });


function Profile()
{
const apiUrl = process.env.REACT_APP_API_URL
const location = useLocation();

const navigate = useNavigate();
const countryCodes = [
    { code: '+1', label: 'Canada (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+91', label: 'India (+91)' },
    { code: '+61', label: 'Australia (+61)' },
    // Add more country codes as needed
  ];
  const [loading, setLoading] = useState(true);
  const [countries,setCountries] = useState([])
  const [regions,setRegions] = useState([])
  const [cities,setCities] = useState([])
  const [certs,setCerts] = useState([])
  const [mentorStyle,setMentorStyles] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState({})
  const [userId, setUserId] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [profileid, setProfileId] = useState(0)
  const [availDate, setAvailDate] = useState(null);
  const today = dayjs();
  const[open, setOpen] = useState(false);
  const [specialization, setSpecialization] = useState('');
  

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
    mentortype:'',
    profession:'',
    membertype:'',
    code:'+1',
    availability: dayjs().format('YYYY-MM-DD') // Ensure initial value is a valid date string
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
   //handle close of custom specialization dialog
    const handleClose = () => {
      setOpen(false);
    }

  
  

  const formRef = useRef(null);

  //handle click of save button
  const handleClick = () => {
    if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    
  };

  //handle availability date selection
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      availability: date ? date.format('YYYY-MM-DD') : null, // Format the date as a string
    });
  };

  //fire when each texfield is populated
  const handleChange = (e) => {
   const { name, value } = e.target;
    
     setFormData({
      ...formData,
      [name]: value,
    });
   // console.log('formdata is: ',formData)
  };
 
  //handle form submission
  const handleSubmit = async (e) => {
    console.log('the value of specialization is :',specialization)
    e.preventDefault();
    if(!validateForm())
    {
        setDlgParameters({title:'Error',text:'One or more mandatory field is missing',sender: 'error'})
        setIsDialogOpen(true)
        return;  
    }
    try {
        
        // Send the form data to the API
        if(!isEdit){
        console.log('authentication id: ',location)
        var updatedForm = {};
        if(specialization != ''){
        updatedForm = {...formData, authid: location.state,certifications:specialization ? formData.certifications.replace('Other',specialization) : formData.certifications};
        }
        else 
        {
          updatedForm = {...formData, authid: location.state};
        }

        console.log('Updated form is: ', updatedForm)
        console.log('Formdata: ',formData)
        const response = await fetch(`${apiUrl}/submit`, {
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
        setDlgParameters({title:'Success',text:'Congratulations on your successful profile creation.\n An agent will get in touch with you to discuss on next steps',sender: 'form'})
        setIsDialogOpen(true)
        }
        //alert('Form submitted successfully!');
      }
      else //update user changes
      {
        setUserId(profileid);
        var updatedForm = {};
        if(specialization != '')
        {
         
          updatedForm = {...formData,certifications:specialization ? formData.certifications.replace('Other',specialization) : formData.certifications};
        
        }
       
        const response = await fetch(`${apiUrl}/update/${profileid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(specialization ? updatedForm : formData),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Success:', result);
        if(result.message === 'Update Success')
        {
        setDlgParameters({title:'Success',text:'Update Succesful',sender:'form'})
        setIsDialogOpen(true)
        }

      }
      } catch (error) {
        console.error('Error:', error);
        //alert('Failed to submit form.');
      }

  };

  //handle update from multiple select
  const handleMultipleSelect = (data) =>
  {
    console.log('received data: ',data)
    if(data.includes('Other'))
      {
        setOpen(true);
      }
    setFormData({
     ...formData,
     certifications: data,
    }
);

  };

  const handleSpecialization = (value) => {
    setSpecialization(value);
  }

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

      if (!formData.mentortype.trim()) {
        newErrors.mentortype = 'Mentor mode is required';
      }
      if (!formData.membertype.trim()) {
        newErrors.membertype = 'Member type is required';
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  //load saved data for editing and update
  const loadProfile = () => {
    if(localStorage.getItem('cachedData'))
    {
      setIsEdit(true)
      const profile = JSON.parse(localStorage.getItem('cachedData'));
      setProfileId(profile.profileid);
      console.log(profile);
      setFormData(formData => ({
        ...profile,
        address: profile.address.split(', ')[0],
        city: profile.address.split(', ')[1],
        region: profile.address.split(', ')[2],
        country: profile.address.split(', ')[3],
        mobile: profile.mobile.substring(profile.mobile.indexOf('-') + 1),
        code: profile.mobile.split('-',2)[0],
        certifications: profile.certs
      }))
      console.log('Form data is: ', formData)
    }
  }

  //fetch parameters
  useEffect(() => {
  const getParameters = async () => {
    try {
        // Send the form data to the API
        const response =  await fetch(`${apiUrl}/parameters`);
  
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
        loadProfile();
        
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
        <div className="page-header-container">
        <PageHeader />
      </div>
        <center style = {{marginTop:80}}><div >
        <form ref = {formRef} onSubmit={handleSubmit}>
       <Stack direction = "row" spacing = {5} >
       <Stack spacing = {5}>
        <label></label>
       <CustomTextField
         name = 'firstname'
          required
          id="outlined-required"
          label="First Name"
          onChange={handleChange}
          value ={formData.firstname}
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
          value ={formData.lastname}
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
          id="outlined-required"
          label="Other name"
          onChange={handleChange}
          value ={formData.othername}
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
          value ={formData.email}
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
          value ={formData.mobile}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < CallIcon/>
             <Select
              name ='code'
              value={formData.code}
              onChange={handleChange}
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
       <label></label>
       <CustomTextField
          name = 'country'
          required
          id="outlined-required"
          label="Country"
          select
          onChange={handleChange}
          value = {formData.country}
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
          label="Province"
          select
          onChange={handleChange}
          value = {formData.region}
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
          value = {formData.city}
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
          value = {formData.address}
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
       <label></label>
        <CustomTextField
         name = 'mentortype'
         id="outlined-required"
          label="MentorShip Style"
          select
          onChange={handleChange}
          value = {formData.mentortype}
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
          <MultipleSelect certs = {certs}  onUpdate = {handleMultipleSelect} value = {formData.certifications ? formData.certifications.split('; ') : []} />

          <CustomTextField
         name = 'membertype'
         id="outlined-required"
          label="Mentorship Role"
          select
          onChange={handleChange}
          value = {formData.membertype}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < CardMembershipIcon/>
           </InputAdornment>
         ),
       },
     }}
          >
     <MenuItem key='1' value='Mentor'>
              Mentor
            </MenuItem>
            <MenuItem key='2' value='Mentee'>
              Mentee
            </MenuItem>
       </CustomTextField>

       <CustomTextField
          name = 'profession'
          label="Profession"
          sx = {{display: 'none'}}
          onChange={handleChange}
          value ={formData.profession}
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < WorkIcon/>
           </InputAdornment>
         ),
       },
     }}
      />
       
       
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <DatePicker 
        name = 'availability'
        label='Select availability date'
        dateformat = 'yyyy-MM-dd'
        onChange = {handleDateChange}
        minDate={today}
        value = {dayjs(formData.availability)} // Parse the date string to a dayjs object
        />
    </LocalizationProvider>
    
    
    
    </Stack>
       </Stack>
       <div style = {{textAlign: 'center',marginTop: 10}}>
       <Button variant = "contained" color = "error" onClick={handleSubmit}>{isEdit ? 'Update' : 'Save'}</Button>
       </div></form>
       </div></center>
       <SimpleBottomNavigation />
      <AlertDialog isOpen={isDialogOpen} onClose={closeDialog} title = {dlgParameters.title} text = {dlgParameters.text} />
      <CustomInput open = {open} handleClose = {handleClose} onSubmit={handleSpecialization} />
   </div>
);

}

export default Profile;
