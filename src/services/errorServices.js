const mongoErrorHandler = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message);
    return `Invalid input data. ${errors.join(' ')}`;
  }

  if (error.name === 'CastError') {
    return `Invalid ${error.path}: ${error.value}.`;
  }

  if (error.code === 11000) {
    return `${Object.values(error.keyValue)} already exists!`;
  }

  return error;
};

module.exports = mongoErrorHandler;
