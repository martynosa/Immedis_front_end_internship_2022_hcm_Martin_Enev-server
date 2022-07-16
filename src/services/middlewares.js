const authServices = require('./authServices');

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
    res.status(500).json({ status: 'Error', message: error.message });
  }
};

//blocks non logged users
const isGuest = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({ status: 'Error', message: 'Not logged in!' });
  }
  next();
};

//blocks employees other than self
const isAuthorized = (req, res, next) => {
  if (req.user.role !== 'hr') {
    if (req.user._id !== req.params.id)
      return res
        .status(500)
        .json({ status: 'Error', message: 'Not authorized!' });
  }
  next();
};
//blocks employees other than self for lr
const isAuthorizedLr = (req, res, next) => {
  if (req.user.role !== 'hr') {
    if (req.user._id !== req.body.ownerId)
      return res
        .status(500)
        .json({ status: 'Error', message: 'Not authorized!' });
  }
  next();
};

//blocks non HRs
const isHr = (req, res, next) => {
  if (req.user.role !== 'hr') {
    return res
      .status(500)
      .json({ status: 'Error', message: "Authorized for HR's only!" });
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
