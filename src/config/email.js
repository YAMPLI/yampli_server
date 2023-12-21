const nodemailer = require('nodemailer');
const { CustomApiError } = require('../utils/errors');
const STRINGS = require('../constants/strings');
const { promisify } = require('util');

/**
 * 유저 데이터 생성 후 인증 이메일 전송
 * @param {String} email 가입유저이메일
 * @param {String} link 인증링크
 * @returns {Promise}
 */

const sendAuthMail = async (email, link) => {
  const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const fromEmail = process.env.EMAIL_ID;
  const option = {
    from: `${fromEmail}@naver.com`,
    to: email,
    subject: '인증 관련 메일.',
    html: `<h1>링크를 클릭하세요</h1> \b\b <a href="${link}">${link}</a>`,
  };
  // smtpTransport.sendMail(option, (err, info) => {}
  const sendMailAsync = promisify(smtpTransport.sendMail).bind(smtpTransport);

  try {
    await sendMailAsync(option);
    return true;
  } catch (err) {
    reject(new CustomApiError(STRINGS.ALERT.AUTH_MAIL_RES_ERR));
  } finally {
    smtpTransport.close();
  }
};

module.exports = {
  sendAuthMail,
};
