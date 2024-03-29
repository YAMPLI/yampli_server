const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');
const path = require('path');
require('dotenv').config();

const { combine, timestamp, printf, colorize } = winston.format;

const logDir = 'logs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};
winston.addColors(colors);

const level = () => {
  const env = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
  return env;
};

// Log Format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  printf((info) => {
    if (info.stack) {
      return `${info.timestamp} ${info.level}: ${info.message} `;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }),
);

// 콘솔에 찍힐 때는 색깔을 구변해서 로깅해주자.
const consoleOpts = {
  handleExceptions: true,
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })),
};

const transports = [
  // 콘솔로그찍을 때만 색넣자.
  new winston.transports.Console(consoleOpts),
  // error 레벨 로그를 저장할 파일 설정
  new WinstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(__dirname, logDir, '/error'),
    filename: '%DATE%.error.log',
    maxFiles: 30, // 최대 30일 분량
    zippedArchive: true,
  }),
  // 모든 레벨 로그를 저장할 파일 설정
  new WinstonDaily({
    level: 'debug',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(__dirname, logDir, '/all'),
    filename: '%DATE%.all.log',
    maxFiles: 7,
    zippedArchive: true,
  }),
  // Info 레벨 로그를 저장할 파일 설정
  new WinstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(__dirname, logDir, '/info'), // 로그 파일을 저장할 디렉토리
    filename: '%DATE%.info.log', // 파일명 형식
    maxFiles: 30, // 로그 파일 유지 개수
    zippedArchive: true, // 로그 파일 압축 여부
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports,
});

module.exports = Logger;
