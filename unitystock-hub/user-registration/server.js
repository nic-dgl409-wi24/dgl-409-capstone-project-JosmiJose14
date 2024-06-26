const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const util = require('util');
const path = require('path');
const multer = require('multer');
// Import the configuration
const config = require('./config');

const app = express();

// Enable CORS for all 
app.use(cors());
app.use(bodyParser.json());

// Use the static files configurations
app.use('/images/division', express.static(path.join(__dirname, config.staticFilesConfig.division)));
app.use('/images/subdivision', express.static(path.join(__dirname, config.staticFilesConfig.subdivision)));
app.use('/images/profile', express.static(path.join(__dirname, config.staticFilesConfig.profile)));
app.use('/images/inventory', express.static(path.join(__dirname, config.staticFilesConfig.inventory)));

// MySQL database connection using configuration from config.js
const connection = mysql.createConnection(config.dbConfig);

// Promisify the query method
connection.query = util.promisify(connection.query);

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Set up authentication with the service account using configuration
const auth = new google.auth.GoogleAuth({
  keyFile: config.googleSheetsConfig.keyFile, // The file path to your service account credentials
  scopes: config.googleSheetsConfig.scopes,
});

const sheets = google.sheets('v4');

const PORT = config.PORT;
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
  const { userId, name, email, password, roleId, divisionId, imageUrl, contactNumber } = req.body;

  function insertUser() {
    // Insert operation
    const insertQuery = 'INSERT INTO users (Name, Email, Password, RoleId, DivisionID, ImageUrl, ContactNumber) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, password, roleId, divisionId, imageUrl, contactNumber], (error, results) => {
      if (error) {// Log the error for debugging purposes
        res.status(500).send({ message: "Failed: User registration failed" });
      } else {
        res.status(201).send({ message: 'User registered successfully', userId: results.insertId });
      }
    });
  }

  if (userId) {
    // Update operation
    const updateQuery = 'UPDATE users SET Name = ?, Email = ?,  RoleId = ?, DivisionID = ?, ImageUrl = ?, ContactNumber = ? WHERE user_id = ?';
    connection.query(updateQuery, [name, email, roleId, divisionId, imageUrl, contactNumber, userId], (error, results) => {
      if (error) {
        res.status(500).send({ message: "Failed: An unexpected error occurred during update" });
      } else {
        res.status(200).send({ message: 'User updated successfully' });
      }
    });
  } else {
    // Pre-check for email and name existence only on insert
    const checkQuery = 'SELECT Email, Name FROM users WHERE Email = ? OR Name = ?';
    connection.query(checkQuery, [email, name], (checkError, checkResults) => {
      if (checkError) {
        res.status(500).send({ message: "Failed: An unexpected error occurred" });
      } else if (checkResults.length > 0) {
        let isDuplicate = false;
        let duplicateField = '';
        checkResults.forEach(result => {
          if (email === result.Email) {
            isDuplicate = true;
            duplicateField = 'Email';
          } else if (name === result.Name) {
            isDuplicate = true;
            duplicateField = 'Name';
          }
        });

        if (isDuplicate) {
          return res.status(400).json({ success: false, message: `Failed: A user with the given ${duplicateField} already exists.` });
        } else {
          insertUser();
        }
      } else {
        insertUser();
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
    const range = 'Sheet1';
    const sheetRange = 'Sheet1'; // Adjust as necessary
    const getAllRequest = {
      spreadsheetId: config.googleSheetsConfig.spreadsheetId,
      range: sheetRange,
      auth: authClient,
    };
    // Fetch all rows to search for an existing division with the same name
    const getAllResponse = await sheets.spreadsheets.values.get(getAllRequest);
    const rows = getAllResponse.data.values || [];
    // Assuming division name is in the second column (B column), adjust if necessary
    const divisionIndex = rows.findIndex(row => row[1] && row[1].toLowerCase() === division.toLowerCase());
    // Check if a division with the same name exists and it's not an update operation
    if (divisionIndex !== -1 && !id) {
      return res.status(400).json({ success: false, error: 'Failed : A department with the same name already exists.' });
    }
    // If an ID is provided, attempt to update an existing division
    if (id) {
      // Fetch all rows to find the one to update      
      let foundRowIndex = rows.findIndex(row => row[0] === id); // Assuming ID is in the first column
      if (foundRowIndex !== -1) {
        // Calculate the actual row index in the sheet, adjusting for header row if present
        const sheetRowIndex = foundRowIndex + 1; // Adjust based on your sheet's header presence
        const updateRange = `${range}!A${sheetRowIndex}:D${sheetRowIndex}`;
        const updateRequest = {
          spreadsheetId:config.googleSheetsConfig.spreadsheetId,
          range: updateRange,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[id, division, supervisor, imageUrl]],
          },
          auth: authClient,
        };

        // Update the existing row
        await sheets.spreadsheets.values.update(updateRequest);
        res.status(200).json({ success: true, message: 'Department updated successfully' });
      } else {
        // Handle case where ID is provided but not found
        res.status(404).json({ success: false, error: 'Department not found with provided ID' });
      }
    } else {
      try {
        // Fetch the last ID from the sheet
        const lastIdResponse = await sheets.spreadsheets.values.get({
          spreadsheetId:config.googleSheetsConfig.spreadsheetId,
          range: 'Sheet1!A:A', // Assuming IDs are in column A
          auth: authClient,
        });
        const lastRow = lastIdResponse.data.values ? lastIdResponse.data.values.length : 0;

        // Determine the next ID value
        let Id;
        if (lastRow === 0) {
          Id = 1;
        } else {
          const lastId = parseInt(lastIdResponse.data.values[lastRow - 1][0], 10);
          Id = isNaN(lastId) ? 1 : lastId + 1;
        }
        const appendRequest = {
          spreadsheetId: config.googleSheetsConfig.spreadsheetId,
          range: 'Sheet1', // Adjust the range as necessary
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[Id, division, supervisor, imageUrl]], // Include new ID
          },
          auth: authClient,
        };
        // Append the new row
        const response = await sheets.spreadsheets.values.append(appendRequest);
        res.status(200).json({ success: true, data: response.data, message: 'Department added successfully' });
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
    spreadsheetId: config.googleSheetsConfig.spreadsheetId,
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
    spreadsheetId: config.googleSheetsConfig.spreadsheetId,
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
      res.status(404).json({ success: false, message: 'Department not found' });
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
    const spreadsheetId = config.googleSheetsConfig.subspreadsheetId; // Ensure this is defined somewhere in your scope

    // Fetch all rows to search for an existing sub-division by name
    const getRequest = {
      spreadsheetId: spreadsheetId,
      range: range,
      auth: authClient,
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);
    const rows = getResponse.data.values || [];
    if (id) {
      let foundRowIndex = rows.findIndex(row => row[0] === id); // Assuming ID is in the first column
      if (foundRowIndex !== -1) {
        // Calculate the actual row index in the sheet, adjusting for header row if present
        const sheetRowIndex = foundRowIndex + 1; // Adjust based on your sheet's header presence
        const updateRange = `${range}!A${sheetRowIndex}:D${sheetRowIndex}`;

        const updateRequest = {
          spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
          range: updateRange,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[id, subdivision, selectedDivision, imageUrl]],
          },
          auth: authClient,
        };

        // Update the existing row
        await sheets.spreadsheets.values.update(updateRequest);
        res.status(200).json({ success: true, message: 'Sub-Department updated successfully' });
      } else {
        // Handle case where ID is provided but not found
        res.status(404).json({ success: false, error: 'Sub-Division not found with provided ID' });
      }
    } else {
      try {
        // Assuming subdivision name is in the second column (B column), adjust the index if necessary
        let foundRowIndex = rows.findIndex(row => row[1].toLowerCase() === subdivision.toLowerCase());

        // Prevent insertion/updation if subdivision with the same name exists
        if (foundRowIndex !== -1) {
          return res.status(400).json({ success: false, error: 'Failed : A sub-department with the same name already exists.' });
        }
        // Fetch the last ID from the sheet
        const getLastIdRequest = {
          spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
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
          spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
          range: 'Sheet1', // Adjust the range as necessary
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [[Id, subdivision, selectedDivision, imageUrl]], // Include new ID
          },
          auth: authClient,
        };
        // Append the new row
        const response = await sheets.spreadsheets.values.append(appendRequest);
        res.status(200).json({ success: true, message: 'Sub-Department added successfully', data: response.data });
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
  const divisionId = req.params.divisionId; // Extract divisionId from the request parameters
  try {
    const filteredSubdivisions = await fetchSubdivisionsDetails(divisionId);
    res.status(200).json({ success: true, data: filteredSubdivisions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
//Utility to fetch subdivision details
async function fetchSubdivisionsDetails(divisionId) {
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
    range: 'Sheet1',
    auth: authClient,
  };
  try {
    const response = await sheets.spreadsheets.values.get(request);
    const allsubdivisions = response.data.values;
    return allsubdivisions.filter(row => row[2] === divisionId);
  } catch (error) {
    console.error('Error fetching subdivision details:', error);
    throw new Error('Failed to fetch data from Google Sheets');
  }
}
app.get('/get-subdivision/:Id', async (req, res) => {
  const divisionId = req.params.Id;
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
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
app.get('/get-subdivisions', async (req, res) => {
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: config.googleSheetsConfig.subspreadsheetId,
    range: 'Sheet1', // Adjust as necessary
    auth: authClient,
  };
  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values || [];
    // Assuming ID is the first column in each row
    if (rows) {
      res.status(200).json({ success: true, data: rows });
    } else {
      res.status(404).json({ success: false, message: 'Division not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
app.get('/inventory', async (req, res) => {
  const { divisionId } = req.query; // Access the DivisionId from query parameters
  // Assume getSubDivisionIdsForDivision is a function that returns an array of SubDivisionIds for a given DivisionId

  try {
    const authClient = await auth.getClient();
    // Fetch the subdivision details (we're assuming this is correctly implemented)
    const subdivisionDetails = await fetchSubdivisionsDetails(divisionId);
    // Extract just the subdivision IDs from the first column
    const subDivisionIds = subdivisionDetails.map(row => row[0]);
    const headers = [
      'Id', 'Name', 'Quantity', 'SubdivisionId', 'ExpiryDate', 
      'ImageUrl', 'Manufacture', 'Supplier', 'LastUpdatedBy', 'LastUpdateTimestamp'
    ];
    const request = {
      spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
      range: 'Sheet1', 
      auth: authClient,
    };
    const allData = await Promise.all(subDivisionIds.map(async (subDivisionId) => {
      // ... API call setup
      const response = await sheets.spreadsheets.values.get(request);
     // Filter the response to only include items for the current subdivisionId
     const filteredData = response.data.values.filter(item => item[3] === subDivisionId);
     return filteredData;
   }));

   const data = [headers, ...[].concat(...allData)];
   res.status(200).json({ success: true, data });
 } catch (error) {
   console.error('Failed to fetch data:', error);
   res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
 }
});

app.get('/inventory/search', async (req, res) => {
  const { name, manufacture, supplier } = req.query;

  const authClient = await auth.getClient();
  const request = {
    spreadsheetId:config.googleSheetsConfig.inventoryspreadsheetId,
    range: 'Sheet1',
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values;

    // Assuming the first row contains headers
    const headers = rows[0].map(header => header);

    const searchName = name?.toLowerCase();
    const searchManufacture = manufacture?.toLowerCase();
    const searchSupplier = supplier?.toLowerCase();

    let results = rows.slice(1).filter(row => {
      const itemName = row[1].toLowerCase(); // Assuming 'Name' is in the second column
      const itemManufacture = row[6].toLowerCase(); // Assuming 'Manufacture' is in the seventh column
      const itemSupplier = row[7].toLowerCase(); // Assuming 'Supplier' is in the eighth column

      let includeRow = true;

      if (searchName && !itemName.includes(searchName)) {
        includeRow = false;
      }

      if (searchManufacture && !itemManufacture.includes(searchManufacture)) {
        includeRow = false;
      }

      if (searchSupplier && !itemSupplier.includes(searchSupplier)) {
        includeRow = false;
      }

      return includeRow;
    }).map(row => {
      // Creating an object for each row based on headers
      let item = {};
      row.forEach((cell, index) => {
        let key = headers[index]; // Getting the key based on the index
        item[key] = cell;
      });
      return item;
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search data in Google Sheets' });
  }
});


app.get('/get-inventory/:Id', async (req, res) => {
  const id = req.params.Id;
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
    range: 'Sheet1', // Adjust as necessary
    auth: authClient,
  };
  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values || [];
    // Assuming ID is the first column in each row
    const inventory = rows.find(row => row[0] === id);
    if (inventory) {
      res.status(200).json({ success: true, data: inventory });
    } else {
      res.status(404).json({ success: false, message: 'Inventory not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});


app.post('/save-inventory', async (req, res) => {
  const {
    id,
    name,
    quantity,
    selectedSubDivision,
    expiryDate,
    imageUrl,
    manufacture,
    supplier,
    LastUpdatedBy,
    LastUpdateTimestamp
  } = req.body;

  try {
    const authClient = await auth.getClient();
    const spreadsheetId = config.googleSheetsConfig.inventoryspreadsheetId; // Ensure this is defined
    const range = 'Sheet1'; // Adjust as necessary for your spreadsheet's name

    // Fetch all rows to search for an existing inventory item with the same name or ID
    const getAllResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${range}!A:Z`, // Adjust as necessary to cover the range of your data
      auth: authClient,
    });

    const rows = getAllResponse.data.values || [];
    const inventoryIndex = id ? rows.findIndex(row => row[0] === id.toString()) : -1;

    if (inventoryIndex !== -1) {
      // Update the existing inventory item
      const updateRange = `${range}!A${inventoryIndex + 1}:J${inventoryIndex + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            [id, name, quantity, selectedSubDivision, expiryDate, imageUrl, manufacture, supplier, LastUpdatedBy, LastUpdateTimestamp],
          ],
        },
        auth: authClient,
      });

      res.status(200).json({ success: true, message: 'Inventory updated successfully.' });
    } else {
      try {
        // Assuming subdivision name is in the second column (B column), adjust the index if necessary
        let foundRowIndex = rows.findIndex(row => row[1].toLowerCase() === name.toLowerCase());

        // Prevent insertion/updation if subdivision with the same name exists
        if (foundRowIndex !== -1) {
          return res.status(400).json({ success: false, error: 'Failed : A sub-department with the same name already exists.' });
        }
        const lastIdResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
          range: 'Sheet1!A:A', // Assuming IDs are in column A
          auth: authClient,
        });
        const lastRow = lastIdResponse.data.values ? lastIdResponse.data.values.length : 0;

        // Determine the next ID value
        let Id;
        if (lastRow === 0) {
          Id = 1;
        } else {
          const lastId = parseInt(lastIdResponse.data.values[lastRow - 1][0], 10);
          Id = isNaN(lastId) ? 1 : lastId + 1;
        }
        // Append a new inventory item
        const appendRequest = {
          spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [
              [Id, name, quantity, selectedSubDivision, expiryDate, imageUrl, manufacture, supplier, LastUpdatedBy, LastUpdateTimestamp]
            ],
          },
          auth: authClient,
        };

        await sheets.spreadsheets.values.append(appendRequest);
        res.status(200).json({ success: true, message: 'Inventory added successfully.' });
      }
      catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ success: false, error: 'Failed to save to Google Sheets.' });
      }
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ success: false, error: 'Failed to save to Google Sheets.' });
  }
});



app.get('/get-inventory/:Id', async (req, res) => {
  const Id = req.params.Id;
  const authClient = await auth.getClient();

  const request = {
    spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
    range: 'Sheet1', // Adjust as necessary
    auth: authClient,
  };

  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values || [];
    // Assuming ID is the first column in each row
    const inventory = rows.find(row => row[0] === Id);

    if (inventory) {
      res.status(200).json({ success: true, data: inventory });
    } else {
      res.status(404).json({ success: false, message: 'Inventory not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });
  }
});
app.get('/get-invertorybySub/:subId', async (req, res) => {
  const subId = req.params.subId; // Extract divisionId from the request parameters
  const authClient = await auth.getClient();
  const request = {
    spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
    range: 'Sheet1', // Adjust as necessary for your spreadsheet's structure
    auth: authClient,
  };
  try {
    const response = await sheets.spreadsheets.values.get(request);
    const rows = response.data.values;
    if (rows.length > 0) {
      const headers = rows[0]; // Assuming the first row contains headers
      // Assuming the SubDivisionId is in a specific column, adjust the index as necessary
      // Note: Column indexes are 0-based, so for example, if SubDivisionId is in the 4th column, the index should be 3.
      const filteredRows = rows.filter((row, index) => index > 0 && row[3] === subId); // Adjust the index 3 to match your SubDivisionId column

      res.status(200).json({ success: true, data: { headers, rows: filteredRows } });
    } else {
      res.status(404).json({ success: false, message: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data from Google Sheets' });

  }

});

app.get('/deleteInventoryById/:Id', async (req, res) => {
  const Id = req.params.Id;
  const authClient = await auth.getClient();
  const sheets = google.sheets({version: 'v4', auth: authClient});

  const readRequest = {
    spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
    range: 'Sheet1', 
    auth: authClient,

  };

  try {
    // Fetching the current data
    const readResponse = await sheets.spreadsheets.values.get(readRequest);
    const rows = readResponse.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === Id) + 1; // +1 since Sheets API is 1-indexed

    if (rowIndex > 0) { // If the item is found
      // Prepare the request for deleting the row
      const batchUpdateRequest = {
        spreadsheetId: config.googleSheetsConfig.inventoryspreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Update this to your specific sheet ID if necessary
                dimension: "ROWS",
                startIndex: rowIndex - 1, // Sheets API uses zero-based indexing, adjust accordingly
                endIndex: rowIndex
              }
            }
          }]
        }
      };
      // Sending the request to delete the row
      await sheets.spreadsheets.batchUpdate(batchUpdateRequest);

      res.status(200).json({ success: true, message: 'Inventory item deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ success: false, error: 'Failed to delete inventory item from Google Sheets.' });
  }
});
