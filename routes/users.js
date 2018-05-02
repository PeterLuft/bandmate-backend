var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

//get all users
router.get('/', user_controller.user_list);

//create user
router.post('/', user_controller.user_create);

//get single user by id
router.get('/:id', user_controller.user_detail);

//delete user by id
router.delete('/:id', user_controller.user_delete);

//update user
router.put('/:id', user_controller.user_update);

module.exports = router;
