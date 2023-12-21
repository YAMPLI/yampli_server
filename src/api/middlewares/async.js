/**
 * 비동기 함수를 래핑하는 고차 함수
 * @param {Function} fn 비동기 작업을 수행하는 함수
 * @returns
 */
const asyncWrap = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      console.log('zoclzocl');
      return next(error);
    }
  };
};

/**
 * socket.io 이벤트 핸들레에서 사용되는 비동기 함수를 래핑하는 고차 함수
 * @param {Function} fn 소켓 통신에서 사용되는 비동기 함수
 * @param {String} errorMessage
 * @returns
 */
const socketAsyncWrap = (socket, fn, errorMessage) => {
  return async (data) => {
    try {
      await fn(socket, data);
    } catch (error) {
      console.error('스포티파이 소켓 통신 에러', error);
      console.error(error.stack);
      socket.emit('error', { message: errorMessage });
    }
  };
};

module.exports = { asyncWrap, socketAsyncWrap };
