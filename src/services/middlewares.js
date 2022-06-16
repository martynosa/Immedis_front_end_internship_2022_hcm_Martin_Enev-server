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
    res.status(500).json(error.message);
  }
};

//blocks non logged users from modifying the items and user and returns error code + message
const isGuest = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json('Not logged in!');
  }
  next();
};

const middlewares = {
  auth,
  isGuest,
};

module.exports = middlewares;
