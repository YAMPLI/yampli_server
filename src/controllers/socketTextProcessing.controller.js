const { socketTextProcessing } = require('../services');

function processList(textData, usersData, socketId, app) {
  const socket = app.get('io');
  let currentUserData = usersData[socketId];

  // 처음 배열에는 아무 데이터가 존재하지 않기 때문에 undefined
  if (!Array.isArray(currentUserData)) {
    currentUserData = [];
    usersData[socketId] = currentUserData; // userArray에 초기화된 배열을 할당
  }
  textData.map((list) => {
    list = list.trim();
    let idx = socketTextProcessing.getLastIndexOfDollarSign(list);
    if (idx !== -1) {
      let sublist = socketTextProcessing.extractSublistFromIndexToEnd(list, idx);
      let parts = sublist.split(',');
      if (parts[3]) {
        parts[3] = socketTextProcessing.removeTimeInfo(parts[3]);
      }
      if (!socketTextProcessing.arrayExists(currentUserData, parts)) {
        currentUserData.push(parts);
      }
    }
  });
  socket.to(socketId).emit('check', socketId + ' ::: ' + currentUserData);

  return currentUserData;
}

module.exports = {
  processList,
};
