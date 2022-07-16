const express = require('express');
const { patchLr } = require('../services/leaveRequestServices');
const leaveRequestServices = require('../services/leaveRequestServices');
const middlewares = require('../services/middlewares');
const helpers = require('../services/helpers');

const router = express.Router();

const createLeaveRequest = async (req, res) => {
  try {
    if (helpers.leaveDaysCalc(req.body.from, req.body.to) < 0)
      throw 'Leave cannot be negative value';
    const updatedEmployee = await leaveRequestServices.createLr(req.body);
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const patchLeaveRequest = async (req, res) => {
  try {
    const updatedEmployee = await patchLr(req.body);
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

// prod
router.post(
  '/',
  middlewares.isGuest,
  middlewares.isAuthorizedLr,
  createLeaveRequest
);
router.patch('/:id', middlewares.isGuest, middlewares.isHr, patchLeaveRequest);

// dev
// router.post('/', createLeaveRequest);

// router.patch('/:id', patchLeaveRequest);

module.exports = router;
