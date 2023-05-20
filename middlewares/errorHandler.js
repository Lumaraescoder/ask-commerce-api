const createCustomError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  };
  
  const handleErrors = (err, req, res, next) => {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  };
  
  module.exports = { createCustomError, handleErrors };