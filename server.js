const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.port || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     port: 3306,
//     // MySQL username,
//     user: 'root',
//     // TODO: Add MySQL password here
//     password: 'BurtsB33s',
//     database: 'business_db'
//   },
//   console.log(`Connected to the business_db database.`)
// );

// module.export = db;