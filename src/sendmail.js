const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., 'gmail', 'yahoo', 'outlook')
    auth: {
        user: 'mcpikebobs@gmail.com', // Your email address
        pass: 'fycs cewl dlhc btsp'  // Your email password or app-specific password
    }
});

// Email options
const mailOptions = {
    from: 'mcpikebobs@gmail.com', // Sender address
    to: 'ekeomaonyenuforo@gmail.com', // List of recipients
    subject: 'Hello from Node.js', // Subject line
    text: 'This is a test email sent from Node.js using nodemailer.', // Plain text body
    html: '<p>This is a test email sent from <b>Node.js</b> using <i>nodemailer</i>.</p>' // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});

module.exports = {
    transporter
}