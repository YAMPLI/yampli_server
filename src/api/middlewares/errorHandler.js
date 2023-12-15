const logger = require('../../config/logger');
const { StatusCodes } = require('http-status-codes');
const errorHandler = (err, req, res, next) => {
  console.log("에러핸들러");
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    errMessage: err.message || '다시 시도해 주세요.',
  };
  try {
    if (!customError) {
      // 추후 클라이언트에서 토큰 받은 후 사용자 인증 미들웨어 걸쳐서 유저벌 료그 기록
      logger.error(`res : ${req.ip}, ${StatusCodes.INTERNAL_SERVER_ERROR} : ${err.name} - ${err.message}`);

      return res.status(customError.statusCode).json({ errMessage: customError.errMessage });
    } else {
      console.log("커스텀에러");
      logger.error(`res : ${req.ip}, ${StatusCodes.INTERNAL_SERVER_ERROR} : ${err.name} - ${err.message}`);

      return res.status(customError.statusCode).json({ errMessage: customError.errMessage });
    }
  } catch (error) {
    return res.status(customError.statusCode).json({ errMessage: customError.errMessage });
  }
};

module.exports = errorHandler;
