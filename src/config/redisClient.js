const { createClient } = require('redis');
const { REDIS } = require('../constants/strings');
let client;

const createRedisClient = () => {
  if (!client) {
    client = createClient({
      enable_offline_queue: false,
    });
    client.on('error', (err) => {
      console.error(err);
      throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('클라이언트 생성'));
    });
  }
};

const clientConnect = async () => {
  try {
    await client.connect();
    return client;
  } catch (err) {
    console.error(err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('연결'));
  }
};

const selectDataBase = async (number) => {
  try {
    await client.select(number);
  } catch (err) {
    console.error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 선택'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 선택'), err);
  }
};
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

const getData = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    console.log(REDIS.PREFIX_DB_SUFFIX_FAIL('getData'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('getData'));
  }
};

const delData = async (key) => {
  try {
    return await client.del(key);
  } catch (err) {
    console.log(REDIS.PREFIX_DB_SUFFIX_FAIL('delData'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('delData'));
  }
};
const disconnect = async () => {
  try {
    await client.quit();
  } catch (err) {
    console.error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 연결 해제'), err);
    throw new Error(REDIS.PREFIX_DB_SUFFIX_FAIL('DB 연결 해제'));
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
