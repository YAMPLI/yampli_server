const logger = require('../../config/logger');
const Joi = require('joi');
const pick = require('../../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    logger.error(new Error(error));
    return next(new Error(error));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
