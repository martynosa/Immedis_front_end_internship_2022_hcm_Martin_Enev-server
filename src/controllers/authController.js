const express = require('express');
const authServices = require('../services/authServices');
const middlewares = require('../services/middlewares');
const helpers = require('../services/helpers');

const router = express.Router();

const registerUser = async (req, res) => {
  const userToRegister = req.body;
  try {
    await authServices.registerUser(userToRegister);
    const loggedUser = await authServices.logUser(userToRegister);
    const token = await authServices.createToken(loggedUser);

    res.status(200).json({
      status: 'Success',
      data: {
        _id: loggedUser._id,
        email: loggedUser.email,
        fullName: loggedUser.fullName,
        role: loggedUser.role,
        photo: loggedUser.photo,
        token: token,
      },
    });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const logUser = async (req, res) => {
  const userToLog = req.body;
  try {
    const loggedUser = await authServices.logUser(userToLog);
    const token = await authServices.createToken(loggedUser);
    res.status(200).json({
      status: 'Success',
      data: {
        _id: loggedUser._id,
        email: loggedUser.email,
        fullName: loggedUser.fullName,
        role: loggedUser.role,
        photo: loggedUser.photo,
        token: token,
      },
    });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

router.post('/register', registerUser);
router.post('/login', logUser);

module.exports = router;
