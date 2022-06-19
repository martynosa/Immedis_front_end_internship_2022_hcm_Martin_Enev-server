const express = require('express');
const authController = require('./controllers/authController');
const employeesController = require('./controllers/employeesController');

const router = express.Router();

router.use('/auth', authController);
router.use('/employees', employeesController);
router.use('*', (req, res) => {
  res.send('404');
});

module.exports = router;
