const AppError = require('./AppError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    err = new AppError(`Invalid input data. ${errors.join(' ')}`, 500);
  }

  if (err.name === 'CastError') {
    err = new AppError(`Invalid ${err.path}: ${err.value}.`, 500);
  }

  if (err.code === 11000) {
    err = new AppError(`${Object.values(err.keyValue)} already exists!`, 500);
  }

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

module.exports = errorHandler;
