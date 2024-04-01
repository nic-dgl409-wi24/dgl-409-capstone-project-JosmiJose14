const path = require('path');

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3001,

  // Database configuration
  dbConfig: {
    host: 'localhost',
    port: 3306,
    // user: 'n0199376_dgl409',
    // password: 'dgl409-unitystockhub',
    // database: 'n0199376_unitystockhub'
    user: 'root',
    password: 'root',
    database: 'user_db'
  },

  // Google Sheets API configuration
  googleSheetsConfig: {
    spreadsheetId: '1-GYq6o3zJ_MlMCqHCmU9XRFyVCyi2gRx8e-kkN2DIaI',
    subspreadsheetId: '12_hbBZt7NU8nj-JfInDxLMvBjpYps82Vw4k2-SHjEXU',
    inventoryspreadsheetId: '1hO7IajrBcAypA8FKjngv9G65ltq8Uw3VV-EFATdJlZI',
    keyFile: path.join(__dirname, 'unitystock-hub-google.json'), // Path to your service account credentials
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  },

  // Static files configuration
  staticFilesConfig: {
    division: '/images/division',
    subdivision: '/images/subdivision',
    profile: '/images/profile',
    inventory: '/images/inventory'
  }
};
