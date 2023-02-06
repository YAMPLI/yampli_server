const express = require('express');
const { UserService } = require('../../services');
const { userController } = require('../../controllers');
const router = express.Router();

//router.post("/users", UserService.insert);
router.route('/user').post(userController.createUser);
router.route('/user/:userId').get(userController.getUsers).patch(userController.updateUser);

module.exports = router;
