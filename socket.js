require('dotenv').config();
const SocketIO = require('socket.io');
const textHandler = require('./src/socketHandlers/song.handler');

/**
 * 웹 소켓 연결 생성 및 처리
 *
 * @param {http.Server} server = HTTP 서버 인스턴스
 * @param {Express.Application} app = express 인스턴스
 */
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
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('새로운 클라이언트 접속!', ip, socket.id, req.socket.remoteAddress);
    connectUsers[ip] = socket.id;

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);

      // 소켓 연결 해재 시 데이터 초기화
      delete connectUsers[ip];
      delete userTextList[socket.id];
      delete lastProcessedIndex[socket.id];
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    // 클라이언트로부터 전송받은 텍스트 데이터 처리
    textHandler(socket, userTextList, lastProcessedIndex);

    socket.on('clientIp', (data) => {
      console.log('client IP : ' + data);
    });

    socket.interval = setInterval(() => {
      socket.emit('state', 'Hello Socket.IO : ' + socket.id);
    }, 10000);
  });
};
