const { ConflictError } = require('../utils/errors');

const arrayExists = (arr, target) => {
  for (let item of arr) {
    if (JSON.stringify(item) === JSON.stringify(target)) {
      return true;
    }
  }
  return false;
};

const getLastIndexOfSign = (input) => {
  return input.lastIndexOf('&');
};

const getArtistSongText = (input, startIndex) => {
  return input.substring(startIndex + 1, input.length).trim();
};

const removeTimeInfo = (input) => {
  let regex = /(오전|오후|이후).+$/;
  let regex1 = /(오전|오후|2후)?\s*(\d+)(?::\d+)?.+$/;
  return input.replace(regex1, '').trim();
};

function processList(textData, usersData, socketId, app) {
  try {
    const socket = app.get('io');
    let currentUserData = usersData[socketId];

    // 처음 배열에는 아무 데이터가 존재하지 않기 때문에 undefined
    if (!Array.isArray(currentUserData)) {
      currentUserData = [];
      usersData[socketId] = currentUserData; // userArray에 초기화된 배열을 할당
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
    socket.to(socketId).emit('check', socketId + ' ::: ' + currentUserData);

    return currentUserData;
  } catch (error) {
    throw new ConflictError('processList Error');
  }
}

module.exports = {
  processList,
};
