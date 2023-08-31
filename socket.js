require('dotenv').config();
const SocketIO = require('socket.io');
const { socketTextProcessingController } = require('./src/controllers');
const textHandler = require('./src/socketHandlers/song.handler');
module.exports = (server, app) => {
  // 소켓에 연결된 유저 정보 저장,
  // key : socket.id, value : userId
  const connectUsers = {};
  const userTextList = {}; // 전달받은 텍스트 데이터 저장
  const lastProcessedIndex = {};
  const io = SocketIO(server, { path: '/socket.io' });
  // 라우터에서 req.app.get('io')로 호출 가능
  app.set('io', io);
  app.set('connectUsers', connectUsers);
  app.set('userTextList', userTextList);

  io.on('connection', (socket) => {
    // 웹소켓 연결 시
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('새로운 클라이언트 접속!', ip, socket.id, req.socket.remoteAddress);
    connectUsers[ip] = socket.id;
    socket.on('disconnect', () => {
      // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);

      if (connectUsers[ip]) {
        delete connectUsers[ip];
      }
      // clearInterval(socket.interval);
    });
    socket.on('error', (error) => {
      // 에러 시
      console.error(error);
    });
    //* 클라이언트에서 전송받은 데이터 출력하고 확인 메시지 전송
    // socket.on('text', (data) => {
    //   console.log(data);
    //   try {
    //     const processedText = socketTextProcessingController.processList(
    //       data.chatText,
    //       userTextList,
    //       socket.id,
    //       app,
    //       ip,
    //       connectUsers,
    //     );
    //   } catch (error) {
    //     // 클라이언트에 에러 메세지 보낸 후 연결 해제하기.
    //     socket.emit('check', 'Error');
    //   }
    // });
    textHandler(socket, userTextList, lastProcessedIndex);

    socket.on('clientIp', (data) => {
      console.log('client IP : ' + data);
    });
    socket.interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      socket.emit('state', 'Hello Socket.IO : ' + socket.id);
    }, 10000);
  });
};
