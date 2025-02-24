import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';



export default function CustomInput({open,handleClose,onSubmit}) {
console.log('The value of open is: ',open);
if(!open) return null;
return(<React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const spec = formJson.specialization;
              console.log(spec);
              onSubmit(spec);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Specify Specialization</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can specify a custom specialization here if not available in the list of provided options
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="specialization"
            label="Specialization"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>)

};

