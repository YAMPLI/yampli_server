const { User, Comment, Like, Group, Reply } = require('../models');
const { ConflictError, CustomApiError, UnauthenticatedError, ForbiddenError } = require('../utils/errors');
const { sendAuthMail } = require('../utils/email');
const { extractQueryParams } = require('../utils/queryStringExtractor');
const redisClient = require('../config/redisClient');
const STRINGS = require('../constants/strings');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
 * 유저 데이터 생성
 * 이미 등록되고 미인증 유저인 경우 새롭게 입력된 데이터로 업데이트
 * 세션에서 가져온 카카오 아이디를 확인하여 이메일 계정과 연동
 *
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const createUserEmail = async (userData) => {
  const functionName = `createUserEmail`;
  // 세션에 저장된 카카오 아이디 사용(카카오 연동)
  const { email, password, kakaoId } = userData;
  const getUser = await findUserByEmail(email);
  let user;
  logger.info(`starting ${functionName} in userService.js`);
  logger.info(`세션에 저장된 카카오 아이디 확인  ${kakaoId} in userService.js`);
  if (getUser && (await emailAuthCheck(getUser))) {
    logger.error(STRINGS.ALERT.CHECK_SIGN_EMAIL);
    throw new ConflictError(STRINGS.ALERT.CHECK_SIGN_EMAIL);
  }
  if (getUser) {
    getUser.password = password;
    getUser.nickname = createNickname();
    if (kakaoId) {
      getUser.kakaoId = kakaoId;
    }
    user = await getUser.save();
  } else {
    user = await User.create({
      email: email,
      password: password,
      nickname: createNickname(),
      kakaoId: kakaoId,
    });
  }
  try {
    // 일회용 토큰 생성
    const token = crypto.randomBytes(32).toString('hex');

    await redisClient.setNamespacedData('0', token, email, 300);
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendAuthMail(email, verificationLink);

    return true;
  } catch (err) {
    throw err;
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

const findUserByKakao = async (kakaoId) => {
  const user = await User.findOne({ kakaoId: kakaoId });
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
      { expiresIn: '10m' },
    );
  } else {
    throw new ConflictError(STRINGS.ALERT.CHECK_INPUT_DATA);
  }
};

const verifyJWT = async (url) => {
  const queryParams = extractQueryParams(url).token;
  try {
    const decoded = jwt.verify(queryParams, process.env.JWT_SECRET);
    const email = decoded.userEmail;
    const user = await findUserByEmail(email);
    const authStatus = await emailAuthCheck(user);
    if (!authStatus) {
      user.emailAuth = !user.emailAuth;
      const updateUser = await user.save();
      return updateUser;
    } else {
      throw new ForbiddenError('만료된 페이지입니다.');
    }
  } catch (err) {
    throw new UnauthenticatedError('회원 가입을 다시 진행해주세요.', true);
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
  verifyJWT,
  findUserByEmail,
  emailAuthCheck,
  findUserByKakao,
};
