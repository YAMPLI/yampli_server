const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const groupRoute = require('./group.route');
const playlistRoute = require('./playlist.route');
const userAuth = require('../middlewares/userAuth');
// const docsRoute = require("./docs.route");

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
// userAuth,
router.use('/group', userAuth, groupRoute);
router.use('/playlist', playlistRoute);

module.exports = router;
