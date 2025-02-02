const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const mysql2 = require('mysql2/promise')
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

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mentor',
  database: 'mentordb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});
//test connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

//test pool
pool.getConnection()
  .then((connection) => {
    console.log('Connection acquired successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('Failed to acquire connection:', err);
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

//get user details
app.get('/userinfo/:id', (req, res) => {
  const userid  = req.params.id
  let query = 'SELECT * from userinfo where id = ?';
    connection.query(query,[userid] ,(err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
  
      if (results.length > 0) {
        const userInfo = results.map((user) => ({
          firstname: user.firstname,
          email: user.email,
          lastname: user.lastname,
          othername: user.othername,
          mobile: user.mobile,
          address: user.address,
          certs: user.professional_certs,
          mentortype: user.mentorship_type

        }));
        const info = userInfo[0]
        return res.status(200).json({ info });
      } else {
        return res.status(200);
      }
    });
  });


//retrieve all profile parameters
app.get('/parameters',  async (req, res) => {
  try {
    console.log('Attempting to get connection from pool');
    const con = await pool.getConnection();
    console.log('Connection acquired successfully');

    // Execute multiple queries
    const [results] = await con.query(`
      SELECT * FROM country;
      SELECT * FROM region;
      SELECT * FROM city;
      SELECT * FROM cert_types;
      select * from mentor_type`);

    // Release the connection back to the pool
    con.release();

    // Send the combined results as a response
    res.json({
      countries: results[0], // First query results
      regions: results[1],
      cities: results[2], 
      certificates: results[3],
      mentorstyle: results[4],
    });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
    connection.query('SELECT id,email,password,profile_id FROM auth WHERE email = ?', [email], (err,result) => {
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
        id: token.id,
        profileid: token.profile_id
    }));
       console.log(auth)
        if(auth[0].email === email && bcrypt.compareSync(password, auth[0].pwd))
        {
          return res.status(200).json({"message": "Authentication successful","id": auth[0].id,"profileid": auth[0].profileid})
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

//upload form data
app.post('/submit', (req, res) => {
  const { firstname,lastname,othername,email,mobile,country,region,city,address,certifications,mentorstyle,authid } = req.body;
  const fulladdress = `${address}, ${city}, ${region}, ${country}`
  //validation checks would be done at client side

  // Insert data into the MySQL database
  connection.query(
    'INSERT INTO userinfo (firstname,lastname,othername,email,mobile,address,professional_certs,mentorship_type) VALUES (?, ?,?,?,?,?,?,?)',
    [firstname,lastname,othername,email,mobile,fulladdress,certifications,mentorstyle],
    (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).send('An error occurred while saving the data.');
      }
        const profileid = results.insertId
        connection.query('update auth set profile_id = ? where id = ?',[profileid,authid],(err,result) =>{
          if(err)
          {
            console.error('Error updating data:', error);
            return res.status(500).send('An error occurred while saving the data.');
          }
          console.log('Data inserted successfully:', result);
          res.status(200).json({"message" : 'Form submitted successfully!',"id": results.insertId});
        })
    }
  );
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});