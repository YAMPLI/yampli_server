require('dotenv').config();
const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // 라우터에서 req.app.get('io')로 호출 가능
  app.set('io', io);

  io.on('connection', (socket) => {
    // 웹소켓 연결 시
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
    socket.on('disconnect', () => {
      // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => {
      // 에러 시
      console.error(error);
    });
    //* 클라이언트에서 전송받은 데이터 출력하고 확인 메시지 전송
    socket.on('text', (data) => {
      console.log(data);
      socket.emit('check', { check: data });
    });

    socket.interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      socket.emit('state', 'Hello Socket.IO');
    }, 3306);
  });
};
