const { StatusCodes } = require('http-status-codes');

const sendResponse = (res, statusCode = StatusCodes.OK, data = {}, message = '') => {
  return res.status(statusCode).json({ success: true, data, message });
};

module.exports = { sendResponse };
