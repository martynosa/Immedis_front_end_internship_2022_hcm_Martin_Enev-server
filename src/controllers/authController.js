const express = require('express');
const authServices = require('../services/authServices');
const middlewares = require('../services/middlewares');
const mongoErrorHandler = require('../services/errorServices');
const multerServices = require('../config/multerConfig');

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
        id: loggedUser._id,
        email: loggedUser.email,
        fullName: loggedUser.fullName,
        photo: loggedUser.photo,
        token: token,
      },
    });
  } catch (error) {
    const message = mongoErrorHandler(error);
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
        id: loggedUser._id,
        email: loggedUser.email,
        fullName: loggedUser.fullName,
        role: loggedUser.role,
        photo: loggedUser.photo,
        token: token,
      },
    });
  } catch (error) {
    const message = mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const profilePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(500).json({
      status: 'Error',
      message: 'Not an image file or no file chosen!',
    });
  }
  try {
    const updatedUser = await authServices.updateUser(req.user.id, {
      photo: req.file.filename,
    });
    res.status(200).json({
      status: 'Success',
      data: updatedUser.photo,
    });
  } catch (error) {
    const message = mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

router.post('/register', registerUser);
router.post('/login', logUser);
router.post(
  '/uploadPhoto',
  middlewares.isGuest,
  multerServices.uploadProfilePhoto,
  multerServices.resizeProfilePhoto,
  profilePhoto
);

module.exports = router;
