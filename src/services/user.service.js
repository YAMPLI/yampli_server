const { User, Comment, Like, Group, Reply } = require('../models');
const { ConflictError, CustomApiError } = require('../utils/errors');
const { sendAuthMail } = require('../config/email');
const STRINGS = require('../constants/strings');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const path = require('path'); // 엑셀 가져올 때 절대 경로로 가져오기 위한 모듈

/**
 * 설계 변경 후 쿼리
 */

/**
 * 상대경로를 절대경로로 변경
 * @param {String} xlsPath
 * @returns {String} 절대경로
 */
const createFilePath = (xlsPath) => {
  const filePath = path.join(__dirname, xlsPath);
  return filePath;
};

/**
 * 엑셀 0번 시트 데이터 읽어오기
 * @param {String} filePath
 * @returns {Object} Json 타입으로 변경된 엑셀 데이터
 */
const excelToJson = (filePath) => {
  // 엑셀 읽기
  const workbook = xlsx.readFile(filePath);
  // 0번째 시트 이름 가져오기
  const sheetName = workbook.SheetNames[0];
  // 시트 데이터 가져오기
  const worksheet = workbook.Sheets[sheetName];
  // Json 변환
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  return jsonData;
};

/**
 * 무작위 엑셀 데이터 추출
 * @param {Object} jsonData
 * @returns {String}
 */
const getRandomDataFromJson = (jsonData) => {
  const dataSize = jsonData.length;
  const randomIndex = Math.floor(Math.random() * dataSize);
  const title = jsonData[randomIndex].Title;

  return title;
};

/**
 * 형용사 + 동물이름 닉네임 생성
 * @returns {String}
 */
const createNickname = () => {
  const ad = excelToJson(createFilePath('../data/ad.xlsx'));
  const animals = excelToJson(createFilePath('../data/animals.xlsx'));

  let nickname;
  let flag = 0;
  do {
    const adTitle = getRandomDataFromJson(ad);
    const animalTitle = getRandomDataFromJson(animals);
    const randomNum = Math.floor(Math.random() * 99999);
    nickname = `${adTitle} ${animalTitle}${randomNum}`;
    flag += 1;
    if (flag == 999999) {
      throw new CustomApiError(STRINGS.ALERT.RETRY_REQ);
    }
  } while (!findNickname(nickname)); // 중복 아닐 때 까지 반복
  return nickname;
};
/**
 * 중복 닉네임 찾기
 * @param {String} nickname
 * @returns {Boolean}
 */
const findNickname = async (nickname) => {
  const user = await User.findOne({ nickname: nickname });
  return !user;
};

/**
 * 유저 생성
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const createUserEmail = async (userData) => {
  try {
    const { email, password } = userData;
    const getUser = await findUserByEmail(email);
    let user;
    if (getUser) {
      const authState = await emailAuthCheck(getUser);
      if (authState) {
        throw new ConflictError(STRINGS.ALERT.CHECK_SIGN_EMAIL);
      }
      // 이미 유저가 등록되었고, 인증만 완료되지 않는 상태인 경우
      getUser.password = password;
      getUser.nickname = createNickname();
      user = await getUser.save();
    } else {
      // 신규 가입
      user = await User.create({
        email: email,
        password: password,
        nickname: createNickname(),
      });
    }
    const token = createJWT(email);
    const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;
    await sendAuthMail(email, verificationLink);

    return false;
  } catch (e) {
    throw e;
  }
};

/**
 * 이메일로 가입된 유저 찾기
 * @param {String} email
 * @returns {Promise<User>}
 */
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

/**
 * 이메일 인증 확인
 * @param {Object<User>} user
 * @returns
 */
const emailAuthCheck = async (user) => {
  const authState = user.emailAuth;
  return authState;
};

/**
 * JWT 생성
 * @param {Object|String} userInfo
 * @returns {string} 생성된 JWT 토큰
 */
const createJWT = (userInfo) => {
  if (typeof userInfo === 'object') {
    return jwt.sign(
      {
        userId: userInfo.id,
        userEmail: userInfo.userEmail,
        userNickname: userInfo.uerNickname,
      },
      process.env.JWT_SECRET,
    );
  } else if (typeof userInfo === 'string') {
    return jwt.sign(
      {
        userEmail: userInfo,
      },
      process.env.JWT_SECRET,
    );
  } else {
    throw new ConflictError(STRINGS.ALERT.CHECK_INPUT_DATA);
  }
};

/**
 * User 데이터 및 연관 데이터 삭제
 * @param {String} userId
 */
const deleteUserAndRelatedData = async (userId) => {
  await Comment.deleteMany({ author: userId });
  await Like.deleteMany({ user: userId });
  await Group.updateMany({}, { $pull: { users: userId } });
  await Reply.deleteMany({ author: userId });
  await User.findOneAndDelete(userId);
};
/**
 * 설계 변경 전 쿼리 모음
 * (추후 삭제 혹은 수정)
 */
/**
 * 사용자 생성
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // 검증 미들웨어 생성 필요
  return await User.create(userBody);
};

/**
 * ID로 사용자 조회
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};

/**
 * ID로 사용자 업데이트
 * @param {String} userId
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, userData) => {
  const user = await getUserById(userId);
  Object.assign(user, userData);
  await user.save();
  return user;
};

/**
 * 사용자의 그룹 조회
 * @param {String} userId
 * @returns {Promise<User[]>}
 */
const findUserGroup = async (userInfo) => {
  return User.find({ userId: userInfo }).populate('groups').exec();
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  createJWT,
  findUserGroup,
  createNickname,
  deleteUserAndRelatedData,
  createUserEmail,
};
