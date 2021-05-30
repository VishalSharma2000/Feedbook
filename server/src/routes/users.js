const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
  res.send('Home Page');
});

route.get('/name', (req, res) => {
  res.send('Users Page');
});

module.exports = route;