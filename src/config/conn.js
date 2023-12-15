const mongoose = require('mongoose');
// 설정한 환경변수 가져오기
require('dotenv').config();
// nodejs의 native Promise 사용
mongoose.Promise = global.Promise;

const connect = () => {
  // 배포용이 아닐 경우 디버깅 모드 ON
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true); // 몽고 쿼리가 콘솔에서 뜨게 한다.
    mongoose.set('strictQuery', true);
  }

  mongoose
    .connect(process.env.MONGODB, {
      dbName: 'study', // 연결할 db명
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('successfully connected to mongodb'))
    .catch((e) => {
      console.log(e);
      process.exit();
    });
};

// connect 메소드 exports
module.exports = connect;
