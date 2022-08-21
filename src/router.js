const express = require('express');
const authController = require('./controllers/authController');
const employeesController = require('./controllers/employeesController');
const leaveRequestController = require('./controllers/leaveRequestController');
const AppError = require('./services/errors/AppError');

const router = express.Router();

router.use('/auth', authController);
router.use('/employees', employeesController);
router.use('/lr', leaveRequestController);
router.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
