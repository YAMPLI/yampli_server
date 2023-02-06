const { userService } = require('../services');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json({ data: user, status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    res.json({ data: user, status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    const user = userService.updateUserById(userId, userData);
    res.send(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createUser,
  getUsers,
  updateUser,
};
