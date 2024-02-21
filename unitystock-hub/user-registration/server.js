const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'user_db'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Define routes here
// ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// ...

app.post('/register', (req, res) => {
    const { name, email, password, roleId, divisionId, imageUrl, jobTitle } = req.body;
  
    // Hash password here if you want to store hashed passwords
    
    const query = 'INSERT INTO users (Name, Email, Password, RoleId, DivisionID, ImageUrl, JobTitle) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    connection.query(query, [name, email, password, roleId, divisionId, imageUrl, jobTitle], (error, results) => {
      if (error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(201).send({ message: 'User registered successfully', userId: results.insertId });
      }
    });
  });
  
  // ...
  