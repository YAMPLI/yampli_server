const { ConflictError } = require('../utils/errors');

/**
 * 배열에 특정 항목이 존재하는지 확인하는 함수
 *
 * @param {Array} arr - 확인할 배열
 * @param {*} target - 확인할 대상 항목
 * @returns {Boolean} 대상 항목이 배열에 존재하면 true, 아니면 false를 반환
 */
const arrayExists = (arr, target) => {
  for (let item of arr) {
    // 클라이언트 소켓으로부터 전달받은 텍스트를 JSON.string으로 변경해서 비교해야 한다.
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

/**
 * 입력 문자열에서 '&' 기호의 마지막 인덱스 반환하는 함수
 *
 * @param {String} input - 입력 문자열
 * @returns '&' 기호의 마지막 인덱스 또는 찾지 못한 경우 -1을 반환
 */
const getLastIndexOfSign = (input) => {
  return input.lastIndexOf('&');
};

/**
 * 입력 문자열에서 가수와 노래 텍스트를 추출해서 반환하는 함수
 *
 * @param {String} input - 입력 문자열
 * @param {Number} startIndex - 추출 시작 인덱스
 * @returns {String} 추출된 가수와 노래 텍스트
 */
const getArtistSongText = (input, startIndex) => {
  return input.substring(startIndex + 1, input.length).trim();
};

/**
 * 입력 문자열에서 시간 정보를 제거하는 함수
 *
 * @param {String} input - 시간 정보가 포함된 입력 문자열
 * @returns {String} 시간 정보가 제거된 문자열
 */
const removeTimeInfo = (input) => {
  let regex = /(오전|오후|2후)?\s*(\d+)(?::\d+)?.+$/;
  return input.replace(regex, '').trim();
};

/**
 * 텍스트 데이터 목록을 처리하고 관련 정보를 추출하는 함수
 *
 * @param {Array} textData - 처리할 텍스트 데이터 목록
 * @param {Object} userTextList - 사용자별 텍스트 데이터 목록
 * @param {String} socketId - 사용자의 소켓 ID
 * @returns {Array} 업데이트된 사용자별 텍스트 데이터 목록
 */
const processList = (textData, userTextList, socketId) => {
  try {
    let currentUserData = userTextList[socketId];
    // 처음 배열에는 아무 데이터가 존재하지 않기 때문에 undefined
    if (!Array.isArray(currentUserData)) {
      currentUserData = [];
      userTextList[socketId] = currentUserData; // userTextList에 원소가 없는 배열 currentUserData 할당
    }
    textData.map((list) => {
      list = list.trim();
      let idx = getLastIndexOfSign(list);
      if (idx !== -1) {
        let sublist = getArtistSongText(list, idx);
        let parts = sublist.split(',');
        if (parts[3]) {
          parts[3] = removeTimeInfo(parts[3]);
        }
        if (!arrayExists(currentUserData, parts)) {
          currentUserData.push(parts);
        }
      }
    });
    return currentUserData;
  } catch (error) {
    throw new ConflictError('processList Error');
  }
};

module.exports = {
  processList,
};
