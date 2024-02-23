const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
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

const sheets = google.sheets('v4');
const spreadsheetId = '1-GYq6o3zJ_MlMCqHCmU9XRFyVCyi2gRx8e-kkN2DIaI'; // Replace with your actual spreadsheet ID
const path = require('path');
const filePath = path.join(__dirname, 'unitystock-hub-google.json');

// Set up authentication with the service account
const auth = new google.auth.GoogleAuth({
  keyFile: filePath, // The file path to your service account credentials
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// ...

// app.get('/get-roles', async (req, res) => {
//   try {
//     const roles = await connection.query('SELECT id, name FROM role'); // Adjust the query according to your DB schema
//     res.status(200).json({ success: true, data: roles });
//   } catch (error) {
//     console.error('Error fetching roles:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch roles' });
//   }
// });
// app.get('/get-jobtitles', async (req, res) => {
//   try {
//     const jobTitles = await connection.query('SELECT id, name FROM jobtitles'); // Adjust the query according to your DB schema
//     res.status(200).json({ success: true, data: jobTitles });
//   } catch (error) {
//     console.error('Error fetching job titles:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch job titles' });
//   }
// });
const util = require('util');

// Promisify the query method
connection.query = util.promisify(connection.query);

app.get('/get-roles', async (req, res) => {
  try {
    const roles = await connection.query('SELECT id, name FROM role'); // Adjust the query according to your DB schema
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});

app.get('/get-jobtitles', async (req, res) => {
  try {
    const jobTitles = await connection.query('SELECT id, name FROM jobtitles'); // Adjust the query according to your DB schema
    res.status(200).json({ success: true, data: jobTitles });
  } catch (error) {
    console.error('Error fetching job titles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch job titles' });
  }
});
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

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Use the query method instead
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      // Handle error
      return res.status(500).json({ message: 'Error querying the database', error });
    }

    if (results.length > 0) {
      // User found
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      // User not found
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

app.post('/save-division', async (req, res) => {
  const { division, supervisor } = req.body;
  const authClient = await auth.getClient();
  try {
    // Fetch the last ID from the sheet
    const getLastIdRequest = {
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:A', // Assuming IDs are in column A
      auth: authClient,
    };
    const lastIdResponse = await sheets.spreadsheets.values.get(getLastIdRequest);
    const lastRow = lastIdResponse.data.values ? lastIdResponse.data.values.length : 0;
    // If there are no existing records, start ID at 1, else increment last ID
    let newId;
    if (lastRow === 0) {
      newId = 1;
    } else {
      const lastId = parseInt(lastIdResponse.data.values[lastRow - 1][0]);
      newId = lastId + 1;
    }

    const appendRequest = {
      spreadsheetId: spreadsheetId,
      range: 'Sheet1', // Adjust the range as necessary
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[newId, division, supervisor]], // Include new ID
      },
      auth: authClient,
    };

    // Append the new row
    const response = await sheets.spreadsheets.values.append(appendRequest);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
    console.error(JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, error: 'Failed to save to Google Sheets' });
  }
});
app.get('/get-divisions', async (req, res) => {
  const authClient = await auth.getClient();

  const request = {
    spreadsheetId: spreadsheetId,
    range: 'Sheet1', // Replace with your actual range
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    res.status(200).json({ success: true, data: response.data.values });
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
