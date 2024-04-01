# Introduction
UnityStock Hub represents a cutting-edge solution designed to modernize and optimize inventory management processes within healthcare facilities, with a primary focus on care homes. In an era where the demand for efficient healthcare services is ever-increasing, the importance of seamless inventory management cannot be overstated. UnityStock Hub steps in to address the critical challenges faced by healthcare administrators, nurses, and IT managers, offering a comprehensive platform that streamlines inventory tracking, enhances stock level visibility, and ultimately ensures the smooth operation of healthcare services.

# To Deploy the UnityStock Hub in cPanel
## For the Client-Side (React.js App)
1. Add the homepage url to package.json
   >  "homepage": "https://dgl409.jjose.imgd.ca/unitystockhub"
2. Change the baseurl which connects to server
3. >   baseUrl: "https://dgl409node.jjose.imgd.ca/userregistration/" 
4. Create a Production Build:
   > npm run build
   
   Run npm run build in your React app's root directory. This will compile your app into static files optimized for production in a build folder.
   
5. Zip the Build Folder:

Compress the build folder into a .zip file for easy uploading.

5. Upload to cPanel:

* Log into your cPanel account.
* Navigate to the File Manager and go to the public_html directory or the directory for your particular domain/subdomain.
* Upload the .zip file of your build folder.
  
6. Extract and Move Files:
   
* Once uploaded, extract the contents of the zip file.
* Rename the folder name to 'unitystockhub'.

7. Configure .htaccess for Single Page Applications:

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
