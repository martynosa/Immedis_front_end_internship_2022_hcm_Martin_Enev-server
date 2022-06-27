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

//blocks non logged users from modifying the items and user and returns error code + message
const isGuest = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({ status: 'Error', message: 'Not logged in!' });
  }
  next();
};

//blocks non owners or employees accessing or modifying data and returns error code + message
const isAuthorized = (req, res, next) => {
  if (req.user.role !== 'hr') {
    if (req.user._id !== req.params.id)
      return res
        .status(500)
        .json({ status: 'Error', message: 'Not authorized!' });
  }
  next();
};

const isHR = (req, res, next) => {
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
  isHR,
};

module.exports = middlewares;
