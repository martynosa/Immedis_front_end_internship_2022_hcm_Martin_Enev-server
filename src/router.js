const express = require('express');
const authController = require('./controllers/authController');
const employeesController = require('./controllers/employeesController');
const leaveRequestController = require('./controllers/leaveRequestController');

const router = express.Router();

router.use('/auth', authController);
router.use('/employees', employeesController);
router.use('/lr', leaveRequestController);
router.use('*', (req, res) => {
  res.send('404');
});

module.exports = router;
