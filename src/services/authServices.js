const userModel = require('../config/models/userModel');
const util = require('util');
const jwt = require('jsonwebtoken');

const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

const registerUser = async (userToRegister) => {
  // need to select only the data required to register(postman)

  await userModel.create(userToRegister);
};

const logUser = async (userToLog) => {
  const { email, password } = userToLog;
  const user = await userModel.findOne({ email });
  if (!email || !password || !user) {
    throw 'Email or Password are invalid!';
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    throw 'Email or Password are invalid!';
  }
  return user;
};

const createToken = async (user) => {
  const { _id, email, role } = user;
  const payload = {
    _id,
    email,
    role,
  };
  const token = await jwtSign(payload, process.env.SECRET);
  return token;
};

const verifyToken = (token) =>
  jwtVerify(token, process.env.SECRET, { expiresIn: '1d' });

const getUser = (id) => userModel.findById(id).lean();

const authServices = {
  registerUser,
  logUser,
  createToken,
  verifyToken,
  getUser,
};

module.exports = authServices;
