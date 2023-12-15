const express = require('express');
const { userController } = require('../../controllers');
const authValidation = require('../../validations/auth.validations');
const validate = require('../middlewares/validate');
const { asyncWrap } = require('../middlewares/async');
const router = express.Router();

//router.post("/users", UserService.insert);
router.route('/user').post(validate(authValidation.register), userController.createUser);
router.route('/user/:userId').get(userController.getUsers).patch(userController.updateUser);

// router.route('/register').post(asyncWrap(userController.createNickname));
router.route('/register').post(asyncWrap(userController.createUserByEmail));

module.exports = router;
