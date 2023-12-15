const nodemailer = require('nodemailer');
const { CustomApiError } = require('../utils/errors');

const sendAuthMail = (email, link) => {
  return new Promise((resolve, reject) => {
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
    smtpTransport.sendMail(option, (err, info) => {
      smtpTransport.close();
      if (err) {
        reject(new CustomApiError('메일전송오류'));
      } else {
        resolve(true);
      }
    });
  });
};
module.exports = {
  sendAuthMail,
};
