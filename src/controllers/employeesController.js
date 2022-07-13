const express = require('express');
const employeeServices = require('../services/employeeServices');
const middlewares = require('../services/middlewares');
const multerServices = require('../config/multerConfig');
const helpers = require('../services/helpers');

const router = express.Router();

const getEmployees = async (req, res) => {
  try {
    const employees = await employeeServices.getEmpls();
    res.status(200).json({ status: 'Success', data: employees });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const getEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await employeeServices.getEmpl(employeeId);
    res.status(200).json({ status: 'Success', data: employee });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const newData = helpers.filterBodyByRole(req.body, req.user.role);
  try {
    const updatedEmployee = await employeeServices.updateEmpl(
      employeeId,
      newData
    );
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    await employeeServices.deleteEmpl(employeeId);
    res.status(200).json({ status: 'Success', data: null });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const uploadProfilePhoto = async (req, res) => {
  const employeeId = req.params.id;
  if (!req.file) {
    return res.status(500).json({
      status: 'Error',
      message: 'Not an image file or no file chosen!',
    });
  }
  try {
    const updatedEmployee = await employeeServices.updatePhotoEmpl(
      employeeId,
      req.file.filename
    );
    res.status(200).json({
      status: 'Success',
      data: updatedEmployee,
    });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const createLeaveRequest = async (req, res) => {
  const employeeId = req.params.id;
  const leaveDays = helpers.leaveDaysCalc(req.body.from, req.body.to);

  if (leaveDays <= 0)
    return res
      .status(500)
      .json({ status: 'Error', message: 'Leave cannot be negative value' });

  try {
    const updatedEmployee = await employeeServices.updateLr(
      employeeId,
      req.body
    );

    res.status(200).json({
      status: 'Success',
      data: updatedEmployee,
    });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const updateLeaveRequest = (req, res) => {
  res.send('updated');
};

router.get('/', middlewares.isGuest, getEmployees);
router.put(
  '/:id/upp',
  middlewares.isGuest,
  middlewares.isAuthorized,
  multerServices.uploadProfilePhoto,
  multerServices.resizeProfilePhoto,
  uploadProfilePhoto
);
router.get('/:id', middlewares.isGuest, middlewares.isAuthorized, getEmployee);
router.put(
  '/:id',
  middlewares.isGuest,
  middlewares.isAuthorized,
  updateEmployee
);
router.delete('/:id', middlewares.isGuest, middlewares.isHR, deleteEmployee);

// Leave request
router.post(
  '/:id/lr',
  middlewares.isGuest,
  middlewares.isAuthorized,
  createLeaveRequest
);

router.put(
  '/:id/lr',
  middlewares.isGuest,
  middlewares.isAuthorized,
  updateLeaveRequest
);

module.exports = router;
