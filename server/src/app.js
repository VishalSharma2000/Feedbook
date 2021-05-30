require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 5000;

/* Connecting with mongodb atlas cluster */
require('../src/db/mongooseConnection');

/* Middlewares */
app.use(express.json());        // For parsing the body of any POST requests
app.use(helmet());
app.use(morgan("common"));

app.get('/', (req, res) => {
  res.send('Feedbook app is working');
});

app.listen(PORT, console.log(`Server is running at http://localhost:${PORT}`));