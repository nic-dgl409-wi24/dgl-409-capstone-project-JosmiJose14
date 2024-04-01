# Introduction
UnityStock Hub represents a cutting-edge solution designed to modernize and optimize inventory management processes within healthcare facilities, with a primary focus on care homes. In an era where the demand for efficient healthcare services is ever-increasing, the importance of seamless inventory management cannot be overstated. UnityStock Hub steps in to address the critical challenges faced by healthcare administrators, nurses, and IT managers, offering a comprehensive platform that streamlines inventory tracking, enhances stock level visibility, and ultimately ensures the smooth operation of healthcare services.

# To Deploy the UnityStock Hub in cPanel
## For the Client-Side (React.js App)
1. Add the homepage url to package.json

  ```  "homepage": "https://dgl409.jjose.imgd.ca/unitystockhub" ``` 
  
3. Change the baseurl which connects to server

  ```   baseUrl: "https://dgl409node.jjose.imgd.ca/userregistration/" ``` 
  
4. Create a Production Build:
   
 ```npm run build```
   
* Run npm run build in your React app's root directory. This will compile your app into static files optimized for production in a build folder.
   
6. Zip the Build Folder:
  * Compress the build folder into a .zip file for easy uploading.

6. Upload to cPanel:

* Log into your cPanel account.
* Navigate to the File Manager and go to the public_html directory or the directory for your particular domain/subdomain.
* Upload the .zip file of your build folder.
  
7. Extract and Move Files:
   
* Once uploaded, extract the contents of the zip file.
* Rename the folder name to 'unitystockhub'.

8. Configure .htaccess for Single Page Applications:

* Modify or create a .htaccess file in  app's root directory to handle routing for a single-page application.
* .htacces file for client side
> <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /unitystockhub/
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]    
</IfModule>

## For the Database 
Step 1. Export  the database from local environment.

Step 1: Create the Database
* Log in to cPanel: Access the hosting account's cPanel dashboard.
* Navigate to MySQL Databases: In the "Databases" section, click on the "MySQL Databases" icon.
* Create a New Database: In the "New Database" field, enter a name for the database and click "Create Database". Remember or note down the database name.
* Go Back: After the database is created, click the "Go Back" link to return to the main database page.

Step 2: Create a Database User
* Navigate to Add New User: Scroll down to the "MySQL Users" section.
* Create a New User: Enter a username and password. Click "Create User".
* Remember the User Details: Note down the username and password. 

Step 3: Add User to the Database
* Add User to Database: Scroll to the "Add User to Database" section.
* Select User and Database: Choose the user and database you just created from the respective drop-down menus.
* Grant Permissions: Click "Add". On the next page, select "All Privileges" to grant all permissions to the user for this database, and click "Make Changes".

Step 4: Import Database to phpMyAdmin
* Access phpMyAdmin: Go back to the cPanel homepage, and in the "Databases" section, click on the "phpMyAdmin" icon.
* Select Your Database: On the left sidebar in phpMyAdmin, click on the new database  created. 
* Import Database:
   * Click on the "Import" tab at the top of the page.
   * Click on "Choose File" and select your database .sql file from your local computer.
   * Scroll down and click on "Go" to start the import process.
 
# Enable the Google Sheets API
 1. Access the Google Cloud Console: Go to the Google Cloud Console.
 2. Create a New Project: Click on the project dropdown at the top of the page, then click on "New Project". Give project a name and click "Create".

* Enable the Google Sheets API:

 1. In the search bar at the top of the dashboard, search for "Google Sheets API".
 2. Click on the Google Sheets API in the search results.
 3. Click "Enable" to enable the API for your project.
 4. Step 2: Create a Service Account and Download Credentials

* Create a Service Account:

1. In the Google Cloud Console, go to the "IAM & Admin" > "Service Accounts" section.
2. Click "Create Service Account".
3. Give the service account a name and description.
4. Click "Create and Continue".
5. Assign the service account a role. For basic Sheets API access as "Editor".
6. Click "Done" to create the service account.
7. Download the JSON Credentials:
8. Click on the newly created service account in the list.
9. Go to the "Keys" tab.
10. Click "Add Key" and choose "Create new key".
11.Select "JSON" as the key type and click "Create".
12 The JSON key file will be automatically downloaded. This file contains the necessary credentials your application will use to authenticate with Google APIs.

* Step 3: Install Google API Node.js Client Library
1. Open your project's Node.js environment and run the following command to install the Google API client library:

 ``` npm install googleapis``` 

* Step 4: Authenticate Your Application with Google API
1. Use the downloaded JSON credentials to authenticate your application. Here's a simplified example of how to do this:

```
const { google } = require('googleapis');
const KEYFILEPATH = 'path/to/your/downloaded-service-account-file.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,   
    scopes: SCOPES>   
});
const sheets = google.sheets({version: 'v4', auth});
```

# For the Server-Side (Node.js App)
1. Prepare Your Node.js Application:
  *  Ensure all dependencies are installed and that your app is running smoothly in a development environment.
  *  Change the sql credentials according to the database credentials created in cPanel.
    
2. Transfer Your Node.js App to cPanel:
 * Zip your Node.js project (excluding the node_modules directory).
 * Upload and extract it into the appropriate directory on  cPanel hosting.
3. Install Node.js on cPanel:
   * navigate to required folder path.
     
    ``` cd folder path```

   * use node version that support the hosting environment.
     
    ``` nvm use 17``` 
4. Reverse Proxy Setup:
 * Set up a reverse proxy to forward requests from the domain to the Node.js app's port using the .htaccess file. 
```
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^dgl409node.jjose.imgd.ca$ [NC]
  RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```
5. Ensure the Application is Running:
  * Keep your Node.js app running after closing the terminal.
    
 ``` nohup node server.js``` 
    
6. Test the Deployment:
Access the Node.js app via the public-facing URL to ensure it is reachable and functioning as expected.
