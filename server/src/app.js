require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

/* Custom Routes */
const userRoute = require('../src/routes/users/index');
const authRoute = require('../src/routes/auth');

/* Constant Variables */
const PORT = process.env.PORT || 5000;
const dev = true;
const morganLogOption = dev ? "dev" : "common";

/* Connecting with mongodb atlas cluster */
require('../src/db/mongooseConnection');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Middlewares */
app.use(express.json());        // For parsing the body of any POST requests
app.use(helmet());              // For securing our application to some extent
app.use(morgan(morganLogOption));      // For loggig all HTTP requests

app.get('/', (req, res) => {
  res.send('Home Page Working');
});

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(PORT, console.log(`Server is running at http://localhost:${PORT}`));