const { TramSharp } = require('@mui/icons-material');
const nodemailer = require('nodemailer');

try{
   const transporter = nodemailer.createTransport({
       host: 'mail.haac.org', 
       port: 465,// Use your email service (e.g., 'gmail', 'yahoo', 'outlook')
       auth: {
           user: 'yemi@haac.ca',
           pass: 'T#036571805332aj'
}});

const mailOptions = {
   from: 'yemi@haac.ca',
   to: 'ikenna@nanawebapps.com',
   subject: 'Testing out nodemailer on nodejs',
   text: 'Hi Ikenna, this is to confirm that you received this email'
}

//send the email
const info = transporter.sendMail(mailOptions, (err, info) => {
   if(err)
   {
       console.log('Error occured: ',err)
   }
   else
   {
       console.log('Email sent with message : ',info.messageId)
   }
});

}
catch(err)
{
 console.log('Error occured: ',err)
}