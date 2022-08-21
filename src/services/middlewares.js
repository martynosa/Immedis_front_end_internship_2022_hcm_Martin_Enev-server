const authServices = require('./authServices');
const AppError = require('./errors/AppError');

//sets the currently logged in user
const auth = async (req, res, next) => {
  const token = req.headers['token'];

  if (!token) {
    return next();
  }

  try {
    const decodedToken = await authServices.verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

//blocks non logged users
const isGuest = (req, res, next) => {
  if (!req.user) {
    next(new AppError('Not logged in!', 401));
  }
  next();
};

//blocks employees other than self
const isAuthorized = (req, res, next) => {
  if (req.user.role !== 'hr') {
    if (req.user._id !== req.params.id)
      next(new AppError('Not authorized!', 403));
  }
  next();
};
//blocks employees other than self for lr
const isAuthorizedLr = (req, res, next) => {
  if (req.user.role !== 'hr') {
    if (req.user._id !== req.body.ownerId)
      next(new AppError('Not authorized!', 403));
  }
  next();
};

//blocks non HRs
const isHr = (req, res, next) => {
  if (req.user.role !== 'hr') {
    next(new AppError("Authorized for HR's only!", 403));
  }
  next();
};

const middlewares = {
  auth,
  isGuest,
  isAuthorized,
  isAuthorizedLr,
  isHr,
};

module.exports = middlewares;
