const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, minLength: 1, maxLength: 100, required: true },
  kakaoId: { type: String, unique: true, sparse: true, default: null }, // sparse : 유니크 필드 null 중복 허용
  createdAt: { type: Date, default: Date.now }, // 작성 시간을 저장하는 필드 추가
  isActive: { type: Boolean, default: true },
  emailAuth: { type: Boolean, default: false },
  img: {
    type: String,
    default: `${process.env.DIRECTORY_IMG}/Users/hanjeongseol/Documents/YAMPLI/yampli_server/src/config/images/profile.png`,
  },
  role: { type: String, default: 'Normal' },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  likedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likedReplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
});

// 비밀번호 검증 인스턴스 메소드 추가
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

// 비밀번호 해싱을 위한 미들웨어
// .pre()는 스키마에 데이터가 저장(.save)되기 전 수행할 작업들을 지정합니다.
userSchema.pre('save', async function (next) {
  const user = this;
  // isModified(field) : field 값이 변경 될 때 해싱 작업 처리
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
