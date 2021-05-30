const route = require('express').Router();

route.get('/', (req, res) => {
  res.send('Auth Route');
});

module.exports = route;