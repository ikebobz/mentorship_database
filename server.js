const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcryptjs')

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(cors());

//MySQl connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'mentor', // Replace with your MySQL password
  database: 'mentordb',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API routes
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const query = 'INSERT INTO auth (username, email, password) VALUES (?, ?,?)';
  connection.query(query, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to insert data' });
    }
    res.status(201).json({ id: results.insertId, username, email });
  });
  //res.json({ message: 'Signup successful' });
});


//check for the existence of a username and email
app.get('/users', (req, res) => {
let query = 'SELECT username,email FROM auth';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length > 0) {
      const existingUsers = results.map((user) => ({
        username: user.username,
        email: user.email,
      }));
      return res.status(200).json({ existingUsers });
    } else {
      return res.status(200);
    }
  });
});


// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//authenticate users
app.post('/authenticate',  (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    connection.query('SELECT id,email,password FROM auth WHERE email = ?', [email], (err,result) => {
      if(err)
      {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if(result.length > 0)
      {
        const auth = result.map((token) => ({
        email: token.email,
        pwd: token.password,
        id: token.id
    }));
       console.log(auth)
        if(auth[0].email === email && bcrypt.compareSync(password, auth[0].pwd))
        {
          return res.status(200).json({"message": "Authentication successful","id": auth[0].id})
        }
        else 
        return res.status(201).json({"message": "credentials does not exist",
      "email": auth.email,"password": auth.pwd})
      }

    });
} catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});