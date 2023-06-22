const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.port || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());