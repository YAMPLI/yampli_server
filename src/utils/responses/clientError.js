const clientErrorResponse = (
  res,
  statusCode,
  data = null,
  errMessage = '문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
) => {
  return res.status(statusCode).json({ data, errMessage });
};

module.exports = clientErrorResponse;
