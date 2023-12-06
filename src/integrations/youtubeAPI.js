const axios = require('axios');

/**
 * 유튜브 API를 사용하지 않고, 가수와 제목 정보를 이용해서 영상 ID를 추출하는 함수
 *
 * @param {String} artist - 가수 이름
 * @param {String} title - 노래 제목
 * @returns {String} 추출된 유튜브 비디오 ID
 */
const getYoutubeVideoId = async (artist, title) => {
  try {
    const searchQuery = `${title} by ${artist} audio`;
    const response = await axios.get(`https://www.youtube.com/results?search_query=${searchQuery}`);
    const videoId = getVideoIdFromResponse(response.data);
    return videoId;
  } catch (error) {
    console.error('유튜브 검색 결과 에러', error);
    throw Error('유튜브 음악 검색 에러 발생');
  }
};

/**
 * 응답 데이터에서 비디오 ID 추출하는 함수
 *
 * @param {String} responseData - 유튜브 검색 결과 페이지의 HTML 데이터
 * @returns {String} 추출된 유튜브 비디오 ID
 */
const getVideoIdFromResponse = (responseData) => {
  let regex = /\"/g;
  const videoId = responseData.split('{"videoRenderer":{"videoId":"')[1].replace(regex, '').split(',thumbnail:')[0];
  return videoId;
};

module.exports = {
  getYoutubeVideoId,
};
