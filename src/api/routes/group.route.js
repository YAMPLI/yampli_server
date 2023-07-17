const express = require('express');
const router = express.Router();
const asyncWrap = require('../middlewares/async');
const { groupController } = require('../../controllers');

router.route('/list').get(asyncWrap(groupController.getGroup));
router.route('/').post(asyncWrap(groupController.createGroup));

// http:localhost:3306/api/group?groupId=123
// router.route('/').get((req, res) => {
//   console.log('test');
//   console.log(req.query.groupId);
//   res.send(req.query.groupId);
// });

module.exports = router;
