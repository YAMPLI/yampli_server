require('dotenv').config();
const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const port = process.env.PORT || 8080;

// 클라이언트에서 connect에 성공 시 호출됩니다.
// io.on('connection', function (socket) {
//   console.log('client connected');

//   socket.on('my message', function (obj) {
//     // 클라이언트에서 'message'라는 이름의 event를 받았을 경우에 호출됩니다.
//     console.log('server received data');
//     console.log(obj['data']);
//     console.log(typeof obj['data']);
//     console.log(obj['data'].length);
//     for (let i = 0; i < obj['data'].length; i++) {
//       if (obj['data'][i].includes('형')) {
//         console.log(obj['data'][i]);
//       }
//     }
//   });

//   socket.on('disconnect', function () {
//     // 클라이언트의 연결이 끊어졌을 때 호출됩니다.
//     console.log('server disconnected');
//   });
// });

/**
 *
 * 클라이언트에서 namespace가 chat로 연결되었을 때 통신,
 * if.of('/namespaces)
 *
 */

// const chat = io.of('/chat');
// chat.on('connection', (socket) => {
//   console.log('chat namespace');

//   socket.on('disconnect', () => {
//     console.log('클라이언트 접속 해제', socket.id);
//     clearInterval(socket.interval);
//   });

//   socket.on('my message', (data) => {
//     console.log('전달받은 데이터 : ', data);
//   });

//   socket.emit('newroom', 'test');
// });

app.get('/', function (req, res) {
  console.log('test');
});

io.on('connection', (socket) => {
  const req = socket.request; // 웹소켓과는 달리 req객체를 따로 뽑아야함

  //* ip 정보 얻기
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
  // socket.id 는 소켓 연결된 고유한 클라이언트 식별자라고 보면된다.

  //* 연결 종료 시
  socket.on('disconnect', () => {
    console.log('클라이언트 접속 해제', ip, socket.id);
    clearInterval(socket.interval);
  });

  //* 에러 시
  socket.on('error', (error) => {
    console.error(error);
  });

  //* 클라이언트에서 전송받은 데이터 출력하고 확인 메시지 전송
  socket.on('text', (data) => {
    console.log(data);
    socket.emit('check', { check: data });
  });

  //* 클라이언트로 메세지 보내기, 같은 포트에서 진행하고 있다.
  socket.interval = setInterval(() => {
    // 3초마다 클라이언트로 메시지 전송
    socket.emit('state', '연결되어있습니다.');
  }, 3306);
});

// 소켓 통신을위해 포트를 지정합니다.
httpServer.listen(port, function () {
  console.log('listening port: 3306');
});
