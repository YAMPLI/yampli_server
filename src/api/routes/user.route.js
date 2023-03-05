const express = require('express');
const { userController } = require('../../controllers');
const authValidation = require('../../validations/auth.validations');
const validate = require('../middlewares/validate');
const router = express.Router();

//router.post("/users", UserService.insert);
router.route('/user').post(validate(authValidation.register), userController.createUser);
router.route('/user/:userId').get(userController.getUsers).patch(userController.updateUser);

module.exports = router;
