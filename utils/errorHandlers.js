const validateLoginInput = (username, password) => {
    if (!username || !password) {
      throw createCustomError(400, 'Username and password are required.');
    }
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
  