require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redisClient.js');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
// const MemoryStore = require('memorystore')(session);
const cors = require('cors');
const passport = require('passport');
const webSocket = require('../socket');
const errorHandler = require('./api/middlewares/errorHandler');
const route = require('./api/routes');
const conn = require('./config/conn.js');
const passportConfig = require('./config/passport/passportConfig');

const app = express();
const port = process.env.PORT || 8000;

app.enable('trust proxy');
// 모든 IP가 trustable하므로 XFF의 첫 번째 아이피(client-ip)가 req.ip값에 설정된다.
app.set('trust proxy', () => true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// origin -> ngrok 테스트 완료 후 CLIENT_HOST로 변경
app.use(cors({ credentials: true, origin: process.env.NGINX_URI }));
conn();

// redis 클리아언트 생성 및 연결
redisClient.createRedisClient();
redisClient.clientConnect();

app.use(
  session({
    store: new RedisStore({ client: redisClient.getClient() }),
    resave: true, // 변경사항 발생 시 만료 시간 갱신
    rolling: true, // 클라이언트 요청 시 만료 시간 갱신
    secret: 'keyboard cat',
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 만료시간 30분 설정
    },
  }),
);
// passport-> 세션 설정 후 미들웨어 등록
app.use(passport.initialize());
app.use(passport.session());

// 세션 사용 위한 테스트
// app.post('/test', (req, res) => {
//   const data = req.body;
//   // 사용자 인증 로직...
//   if (data) {
//     // 사용자 인증 성공 시, 세션에 정보 저장
//     req.session.userId = data.email;
//     res.send('Logged in!');
//   } else {
//     res.send('Authentication failed');
//   }
// });

// app.get('/test2', (req, res) => {
//   console.log(req.session);
//   if (req.session.userId) {
//     // 세션에서 userId 가져오기
//     const userId = req.session.userId;
//     // userId를 사용하여 필요한 작업 수행
//     res.send(`User ID is: ${userId}`);
//   } else {
//     res.send('You are not logged in!');
//   }
// });

app.use('/api', route);
app.use(errorHandler);

// 소켓연결
const server = app.listen(port, () => console.log('server listening on port' + port));
webSocket(server, app);

// 앱 종료시 레디스 클라이언트 연결 해제
process.on('SIGINT', async () => {
  await redisClient.disconnect();
  process.exit(0);
});
module.exports = app;
