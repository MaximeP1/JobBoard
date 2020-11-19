# JobBoard

This project is a simple website to add a job advertisement or to find one.

## Database :
![Database](/database.png)

## Get started

You should install `mysql` or `mariaDB` and `node/npm` in order to run this project.

Run `npm install` to download all dependencies.

Fill the `.env-sample` with your own informations to connect to your database and rename it `.env`.

Run `node app` to start the server. (default port : 3000)

## Fill Database
You can use `node fillDatabase.js` to fill the database with random values and create default users.

## Test users :
Default users if you use the fillDatabase script
* Admin user
    * Email : `admin`
    * Password : `admin`
* Applicant user
    * Email : `jack@jobboard.com`
    * Password : `secret`
* Recruiter user
    * Email : `michel@jobboard.com`
    * Password : `password`
