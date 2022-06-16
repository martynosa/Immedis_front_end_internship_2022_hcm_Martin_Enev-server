const express = require('express');
const authController = require('./controllers/authController');

const router = express.Router();

router.use('/auth', authController);
router.use('*', (req, res) => {
  res.send('404');
});

module.exports = router;
