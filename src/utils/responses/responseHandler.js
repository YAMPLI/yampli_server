const { StatusCodes } = require('http-status-codes');

const sendResponse = (res, statusCode = StatusCodes.OK, data = {}, message = '', errMessage = null) => {
  const code = statusCode.toString();
  let success = true;
  if (code[0] != '2') {
    success = false;
  }
  return res.status(statusCode).json({ success, data, message, errMessage });
};

module.exports = { sendResponse };
