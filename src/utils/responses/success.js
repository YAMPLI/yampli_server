const { StatusCodes } = require('http-status-codes');

const successResponse = (res, data, message = '') => {
  return res.status(StatusCodes.OK).json({ data, message });
};

module.exports = successResponse;
