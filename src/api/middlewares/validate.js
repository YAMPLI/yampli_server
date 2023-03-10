const validate = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validateAsync(body);
  } catch (err) {
    return res.status(400).json({ code: 400, status: 'input_stringType' });
  }
  next();
};

module.exports = validate;
