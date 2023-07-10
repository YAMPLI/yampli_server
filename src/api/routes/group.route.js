const express = require('express');
const router = express.Router();
const asyncWrap = require('../middlewares/async');
const { groupController } = require('../../controllers');

router.route('/list').get(asyncWrap(groupController.getGroup));
router.route('/').post(asyncWrap(groupController.createGroup));

module.exports = router;
