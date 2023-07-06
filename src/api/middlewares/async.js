const asyncWrap = (fn) => {
  // FIXME: Promise와 catch를 이용하면 더 간결해질 것 같습니다.
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = asyncWrap;
