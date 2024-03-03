const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const app = express();
const fs = require('fs');
const util = require('util');
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
const sheets = google.sheets('v4');
app.use('/images/division', express.static(path.join(__dirname, '/images/division')));
app.use('/images/subdivision', express.static(path.join(__dirname, '/images/subdivision')));
app.use('/images/profile', express.static(path.join(__dirname, '/images/profile')));
app.use('/images/inventory', express.static(path.join(__dirname, '/images/inventory')));
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


const spreadsheetId = '1-GYq6o3zJ_MlMCqHCmU9XRFyVCyi2gRx8e-kkN2DIaI'; // Replace with your actual spreadsheet ID
const subspreadsheetId = '12_hbBZt7NU8nj-JfInDxLMvBjpYps82Vw4k2-SHjEXU';
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

//Register save image
// Function to check directory existence and create if doesn't exist
function ensureDirSync(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.error(`Error in creating directory: ${err.message}`);
  }
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use multer memory storage to temporarily hold the file
    cb(null, '/tmp/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Configure multer
const upload = multer({ storage: storage }).single('imageUrl');

// Endpoint for image upload
app.post('/upload-image', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error occurred while uploading' });
    }

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Now req.body.dirPath is accessible
    let dirPathFromRequest = req.body.dirPath || './images/profile/';
    const dirPath = path.join(__dirname, dirPathFromRequest);
    ensureDirSync(dirPath);

    // Move file from temporary location to desired location
    const finalPath = path.join(dirPathFromRequest, req.file.filename);
    fs.rename('/tmp/' + req.file.filename, finalPath, function (err) {
      if (err) {
        return res.status(500).send({ message: 'Error occurred while moving the file' });
      }

      // Send the file path as a response

      res.send({ imageUrl: finalPath });
    });
  });
});


// Promisify the query method
connection.query = util.promisify(connection.query);

app.get('/get-roles', async (req, res) => {
  try {
    const roles = await connection.query('SELECT id, name FROM role'); // Adjust the query according to your DB schema
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});

app.get('/get-jobtitles', async (req, res) => {
  try {
    const jobTitles = await connection.query('SELECT id, name FROM jobtitles'); // Adjust the query according to your DB schema
    res.status(200).json({ success: true, data: jobTitles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch job titles' });
  }
});

app.get('/get-users', async (req, res) => {
  try {
    const roles = await connection.query('SELECT * FROM users'); // Adjust the query according to your DB schema
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});
app.post('/register', (req, res) => {
  const { userId, name, email, password, roleId, divisionId, imageUrl, jobTitle, contactNumber } = req.body;
  if (userId) {
    // Assuming you're passing a userId, it's an update operation
    const updateQuery = 'UPDATE users SET Name = ?, Email = ?, RoleId = ?, DivisionID = ?, ImageUrl = ?, JobTitle = ?, ContactNumber = ? WHERE user_id = ?';

    // Hash password here if you want to store hashed passwords

    connection.query(updateQuery, [name, email, roleId, divisionId, imageUrl, jobTitle, contactNumber, userId], (error, results) => {
      if (error) {
        let userMessage = "An unexpected error occurred";
        if (error.code === "ER_DUP_ENTRY") {
          userMessage = "A user with the given email already exists";
        } else if (error.code === "ER_NO_REFERENCED_ROW") {
          userMessage = "Provided role or division does not exist";
        }

        // For development, you might include the error message:
        // res.status(500).send({ message: userMessage, error: error.message });
        // For production, exclude error details:
        res.status(500).send({ message: userMessage });
      } else {
        res.status(200).send({ message: 'User updated successfully' });
      }
    });
  } else {
    // It's a registration operation
    const insertQuery = 'INSERT INTO users (Name, Email, Password, RoleId, DivisionID, ImageUrl, JobTitle, ContactNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    // Hash password here if you want to store hashed passwords

    connection.query(insertQuery, [name, email, password, roleId, divisionId, imageUrl, jobTitle, contactNumber], (error, results) => {
      if (error) {
        res.status(500).send({ message: error.message });
      } else {
        res.status(201).send({ message: 'User registered successfully', userId: results.insertId });
      }
    });
  }
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
  const { id, division, supervisor, imageUrl } = req.body; // Step 1: Extract ID
  const authClient = await auth.getClient();
  try {
    const range = 'Sheet1'; // Adjust as necessary. Assuming 'Sheet1' is where your data is stored.
    debugger
    // If an ID is provided, attempt to update an existing division
    if (id) {

      // Fetch all rows to find the one to update
      const getRequest = {
        spreadsheetId: spreadsheetId,
        range: range,
        auth: authClient,
      };
      const getResponse = await sheets.spreadsheets.values.get(getRequest);
      const rows = getResponse.data.values || [];
      let foundRowIndex = rows.findIndex(row => row[0] === id); // Assuming ID is in the first column

      if (foundRowIndex !== -1) {
        // Calculate the actual row index in the sheet, adjusting for header row if present
        const sheetRowIndex = foundRowIndex + 1; // Adjust based on your sheet's header presence
        const updateRange = `${range}!A${sheetRowIndex}:D${sheetRowIndex}`;

        const updateRequest = {
          spreadsheetId: spreadsheetId,
          range: updateRange,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[id, division, supervisor, imageUrl]],
          },
          auth: authClient,
        };

        // Update the existing row
        await sheets.spreadsheets.values.update(updateRequest);
        res.status(200).json({ success: true, message: 'Division updated successfully' });
      } else {
        // Handle case where ID is provided but not found
        res.status(404).json({ success: false, error: 'Division not found with provided ID' });
      }
    } else {
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
        let Id;
        if (lastRow === 0) {
          Id = 1;
        } else {
          const lastId = parseInt(lastIdResponse.data.values[lastRow - 1][0]);
          Id = lastId + 1;
        }

        const appendRequest = {
          spreadsheetId: spreadsheetId,
          range: 'Sheet1', // Adjust the range as necessary
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[Id, division, supervisor, imageUrl]], // Include new ID
          },
          auth: authClient,
        };

        // Append the new row
        const response = await sheets.spreadsheets.values.append(appendRequest);
        res.status(200).json({ success: true, data: response.data });
      } catch (error) {

        res.status(500).json({ success: false, error: 'Failed to save to Google Sheets' });
      }
    }
  } catch (error) {
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
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
app.get('/get-division/:divisionId', async (req, res) => {
  const divisionId = req.params.divisionId;
  const authClient = await auth.getClient();

  const request = {
    spreadsheetId: spreadsheetId,
    range: 'Sheet1', // Adjust as necessary
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values || [];
    // Assuming ID is the first column in each row
    const division = rows.find(row => row[0] === divisionId);

    if (division) {
      res.status(200).json({ success: true, data: division });
    } else {
      res.status(404).json({ success: false, message: 'Division not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});


app.post('/save-subdivision', async (req, res) => {
  const { id, subdivision, selectedDivision, imageUrl } = req.body; // Step 1: Extract ID
  const authClient = await auth.getClient();
  try {
    const range = 'Sheet1'; // Adjust as necessary. Assuming 'Sheet1' is where your data is stored.
    debugger
    // If an ID is provided, attempt to update an existing division
    if (id) {

      // Fetch all rows to find the one to update
      const getRequest = {
        spreadsheetId: subspreadsheetId,
        range: range,
        auth: authClient,
      };
      const getResponse = await sheets.spreadsheets.values.get(getRequest);
      const rows = getResponse.data.values || [];
      let foundRowIndex = rows.findIndex(row => row[0] === id); // Assuming ID is in the first column

      if (foundRowIndex !== -1) {
        // Calculate the actual row index in the sheet, adjusting for header row if present
        const sheetRowIndex = foundRowIndex + 1; // Adjust based on your sheet's header presence
        const updateRange = `${range}!A${sheetRowIndex}:D${sheetRowIndex}`;

        const updateRequest = {
          spreadsheetId: subspreadsheetId,
          range: updateRange,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[id, subdivision, selectedDivision, imageUrl]],
          },
          auth: authClient,
        };

        // Update the existing row
        await sheets.spreadsheets.values.update(updateRequest);
        res.status(200).json({ success: true, message: 'Sub-Division updated successfully' });
      } else {
        // Handle case where ID is provided but not found
        res.status(404).json({ success: false, error: 'Sub-Division not found with provided ID' });
      }
    } else {
      try {
        // Fetch the last ID from the sheet
        const getLastIdRequest = {
          spreadsheetId: subspreadsheetId,
          range: 'Sheet1!A:A', // Assuming IDs are in column A
          auth: authClient,
        };
        const lastIdResponse = await sheets.spreadsheets.values.get(getLastIdRequest);
        const lastRow = lastIdResponse.data.values ? lastIdResponse.data.values.length : 0;
        // If there are no existing records, start ID at 1, else increment last ID
        let Id;
        if (lastRow === 0) {
          Id = 1;
        } else {
          const lastId = parseInt(lastIdResponse.data.values[lastRow - 1][0]);
          Id = lastId + 1;
        }

        const appendRequest = {
          spreadsheetId: subspreadsheetId,
          range: 'Sheet1', // Adjust the range as necessary
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[Id, subdivision, selectedDivision, imageUrl]], // Include new ID
          },
          auth: authClient,
        };

        // Append the new row
        const response = await sheets.spreadsheets.values.append(appendRequest);
        res.status(200).json({ success: true, data: response.data });
      }

      catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save to Google Sheets', details: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save to Google Sheets' });
  }
});

app.get('/get-subdivisions/:divisionId', async (req, res) => {
  const authClient = await auth.getClient();

  const request = {
    spreadsheetId: subspreadsheetId,
    range: 'Sheet1', // Replace with your actual range
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    res.status(200).json({ success: true, data: response.data.values });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
app.get('/get-subdivision/:Id', async (req, res) => {
  const divisionId = req.params.Id;
  const authClient = await auth.getClient();

  const request = {
    spreadsheetId: subspreadsheetId,
    range: 'Sheet1', // Adjust as necessary
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values || [];
    // Assuming ID is the first column in each row
    const division = rows.find(row => row[0] === divisionId);

    if (division) {
      res.status(200).json({ success: true, data: division });
    } else {
      res.status(404).json({ success: false, message: 'Division not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
