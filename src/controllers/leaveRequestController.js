const express = require('express');
const { patchLr } = require('../services/leaveRequestServices');
const leaveRequestServices = require('../services/leaveRequestServices');
const middlewares = require('../services/middlewares');
const helpers = require('../services/helpers');

const router = express.Router();

const createLeaveRequest = async (req, res, next) => {
  if (helpers.leaveDaysCalc(req.body.from, req.body.to) < 0) {
    next(new AppError('Leave cannot be negative value', 400));
  }

  try {
    const updatedEmployee = await leaveRequestServices.createLr(req.body);
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

const patchLeaveRequest = async (req, res, next) => {
  try {
    const updatedEmployee = await patchLr(req.body);
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    next(error);
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
