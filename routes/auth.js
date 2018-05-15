var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/authController');

//login user
router.post('/', auth_controller.login);

module.exports = router;