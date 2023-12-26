const { createClient } = require('redis');
const { REDIS } = require('../constants/strings');
let client;
let isConnected = false;
/**
 * Redis 연결
 */
const createRedisClient = () => {
  if (!client) {
    client = createClient({
      enable_offline_queue: false,
    });
    client.on('error', (err) => {
      console.error(err);
      throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('클라이언트 생성'));
    });
    client.on('connect', () => {
      console.log('레디스 연결 성공');
    });

    client.on('ready', () => {
      isConnected = true;
    });

    client.on('end', () => {
      isConnected = false;
    });
  }
};

/**
 * 클라이언트 연결 후 반환
 * @returns client
 */
const clientConnect = async () => {
  if (!isConnected) {
    try {
      await client.connect();
    } catch (err) {
      console.error(err);
      throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('연결'));
    }
  }
  return client;
};

/**
 * 사용할 DB 선택
 * @param {Number} number 사용할 DB
 */
const selectDataBase = async (number) => {
  try {
    await client.select(number);
  } catch (err) {
    console.error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 선택'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 선택'), err);
  }
};

/**
 * 데이터 추가 및 유효시간 설정
 *
 * @param {String} key
 * @param {String} value
 * @param {Number} timeout - 유효기간
 */
const setData = async (key, value, timeout = null) => {
  try {
    await client.set(key, value);
    if (timeout) {
      await client.expire(key, timeout);
    }
  } catch (err) {
    console.error(REDIS.PREFIX_DB_SUFFIX_FAIL('setData'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('setData'));
  }
};

/**
 * 데이터 가져오기
 * @param {String} key
 * @returns {String}
 */
const getData = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    console.log(REDIS.PREFIX_DB_SUFFIX_FAIL('getData'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('getData'));
  }
};

/**
 * 데이터 삭제
 * @param {String} key
 * @returns {}
 */
const delData = async (key) => {
  try {
    return await client.del(key);
  } catch (err) {
    console.log(REDIS.PREFIX_DB_SUFFIX_FAIL('delData'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('delData'));
  }
};

/**
 * 클라이언트 연결 상태를 확인해여 해제
 */
const disconnect = async () => {
  if (isConnected) {
    try {
      await client.quit();
      isConnected = false;
    } catch (err) {
      console.error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 연결 해제'), err);
      throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 연결 해제'));
    }
  }
};

module.exports = {
  createRedisClient,
  clientConnect,
  disconnect,
  setData,
  getData,
  selectDataBase,
  delData,
};
