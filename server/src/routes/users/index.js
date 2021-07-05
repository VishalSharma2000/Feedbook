const router = require('express').Router();
const { authenticationUserToken: verifyUser } = require('../../middleware/auth');

const loggedUserRoute = require('./currUser');
const otherUserRoute = require('./users');

router.use('/me', verifyUser, loggedUserRoute);
router.use('/', verifyUser, otherUserRoute);

module.exports = router;