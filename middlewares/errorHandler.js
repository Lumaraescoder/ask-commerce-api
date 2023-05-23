const { createCustomError } = require('../utils/errorHandlers');

const handleErrors = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: 'An unexpected error occurred.' });
};

const withErrorHandling = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { handleErrors, withErrorHandling };