require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./api/routes');
const conn = require('./config/conn.js');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const passportConfig = require('./config/passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const webSocket = require('../socket');
const errorHandler = require('./api/middlewares/errorHandler');
const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_HOST }));
conn();
passportConfig();
app.use(
  session({
    cookie: { maxAge: 86400000, secure: false },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat',
  }),
);
// passport-> 세션 설정 후 미들웨어 등록
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', route);
app.use(errorHandler);

// 소켓연결
const server = app.listen(port, () => console.log('server listening on port' + port));
webSocket(server, app);
