const Ajv = require('ajv');

const ajv = Ajv();

/**
 * Compiles and validates the schema.
 */
const validate = (schema) => (req, res, next) => {
  const validator = ajv.compile(schema);

  const isValid = validator(req.body);

  if (isValid === false) {
    return res.status(400).json({
      status: 400,
      type: 'validator',
      errors: validator.errors[0].message,
    });
  }

  return next();
};

module.exports = validate;
