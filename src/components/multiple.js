import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import StyleIcon from '@mui/icons-material/Style';
import InputAdornment from '@mui/material/InputAdornment';
import BadgeIcon from '@mui/icons-material/Badge';
import { useEffect, useState } from 'react';





const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(name, certNames, theme) {
  return {
    fontWeight: certNames.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect(prop) {
  const theme = useTheme();

  const [certs,setCerts] = React.useState([
    {
        id: 1,
        description: 'CIMT',
    },
    {
          id: 2,
          description: 'CIT',
    },
    {
            id: 3,
            description: 'PPT'
    }
]);


  const [certNames, setCertNames] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value)
    setCertNames(certNames => [...certNames,...value]
    );
    console.log(value.join('; '))
    prop.onUpdate(value.join('; '));
  };
  useEffect(() => {
    setCerts(prop.certs);
    if(prop.value)
    {
      console.log('passed on certifiactes: ',prop.value)
      setCertNames(prop.value)
      console.log('set certificates: ',certNames)
    }
  }, []);
  

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-name-label">Certifications</InputLabel>
        <Select sx ={{width: 400}}
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={certNames}
          onChange={handleChange}
          input={<OutlinedInput label="Certifications" />}
          MenuProps={MenuProps}
          startAdornment = {
            <InputAdornment position="start">
             < BadgeIcon/>
           </InputAdornment>
          }
        >
          {certs.map((entry) => (
            <MenuItem
              key={entry.id}
              value={entry.description}
              style={getStyles(entry, certNames, theme)}
            >
              {entry.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
