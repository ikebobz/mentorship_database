import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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

const CustomTextField = styled(TextField)({
    width: '400px',
  });


function Profile()
{
const navigate = useNavigate();

return (
    <div class = "profile">
        <div class = "imagecontainer">
        <img src = {logo} alt = "site-logo"/>
        </div>
        <div class = "stacks">
       <Stack direction = "row" spacing={5}>
       <Stack spacing = {5}>
        <label>Personal Details</label>
       <CustomTextField
          required
          id="outlined-required"
          label="First Name"
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
          required
          id="outlined-required"
          label="Last Name"
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
          required
          id="outlined-required"
          label="Other name"
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
          required
          id="outlined-required"
          label="Contact"
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < CallIcon/>
           </InputAdornment>
         ),
       },
     }}
        />
       </Stack>
       <Stack spacing = {5}>
       <label>Geographical Details</label>
       <CustomTextField
          required
          id="outlined-required"
          label="Country"
          select
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
        <CustomTextField
          required
          id="outlined-required"
          label="Region"
          select
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
        <CustomTextField
          required
          id="outlined-required"
          label="City"
          select
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
        <CustomTextField
          required
          id="outlined-required"
          label="Street Address"
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
          required
          id="outlined-required"
          label="Professional Certification"
          select
          slotProps={{
            input: {
            startAdornment: (
           <InputAdornment position="start">
             < BadgeIcon/>
           </InputAdornment>
         ),
       },
     }}
        />
        <CustomTextField
          required
          id="outlined-required"
          label="Membership Style"
          select
          />
       </Stack>
       </Stack>
       <div class = "save">
       <Button variant = "contained" color = "error">Save</Button>
       </div>
        </div>
      <center><SimpleBottomNavigation /></center>
    </div>
);

}

export default Profile;
