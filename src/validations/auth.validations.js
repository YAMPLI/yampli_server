const joi = require('joi');

const register = {
  body: joi
    .object()
    .keys({
      userId: joi.string().required(),
      userName: joi.string().required(),
      userEmail: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .lowercase(),
      userNickname: joi.string().required().min(1).max(30),
    })
    .options({ allowUnknown: true }),
};

module.exports = {
  register,
};
