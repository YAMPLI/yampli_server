const axios = require('axios');
const fs = require('fs');

/**
 * 유튜브API를 사용하지 않고 영상 id 추출
 * @param String artist
 * @param String title
 * @returns 유튜브 비디오 id 반환
 */
const getYoutubeVideoId = async (artist, title) => {
  try {
    const word = `${title} by ${artist} audio`;
    const response = await axios.get(`https://www.youtube.com/results?search_query=${word}`);
    let regex = /\"/g;
    const check = response.data.split('{"videoRenderer":{"videoId":"')[1].replace(regex, '').split(',thumbnail:')[0];
    return check;
  } catch (error) {
    console.error('유튜브 검색 결과 에러', error);
    throw Error('유튜브 음악 검색 에러 발생');
  }
};

module.exports = {
  getYoutubeVideoId,
};
