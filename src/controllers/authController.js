const express = require('express');
const authServices = require('../services/authServices');

const router = express.Router();

const registerUser = async (req, res, next) => {
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
    next(error);
  }
};

const logUser = async (req, res, next) => {
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
    next(error);
  }
};

router.post('/register', registerUser);
router.post('/login', logUser);

module.exports = router;
