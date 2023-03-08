const joi = require('joi');

const register = joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string(),
});

module.exports = {
  register,
};
