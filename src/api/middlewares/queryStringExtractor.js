const url = require('url');
const querystring = require('querystring');

/**
 * URL에서 쿼리스트링 추출 함수
 * @param {string} urlString - 추출할 URL
 * @returns {Object} - 쿼리스트링 파라미터 객체
 */
const extractQueryParams = (urlString) => {
  const parsedUrl = url.parse(urlString);
  const queryParams = querystring.parse(parsedUrl.query);
  return queryParams;
};

module.exports = { extractQueryParams };
