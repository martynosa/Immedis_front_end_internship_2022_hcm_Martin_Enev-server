const express = require('express');
const employeeServices = require('../services/employeeServices');
const middlewares = require('../services/middlewares');
const multerServices = require('../config/multerConfig');
const helpers = require('../services/helpers');
const AppError = require('../services/errors/AppError');

const router = express.Router();

const getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeServices.getEmpls();
    res.status(200).json({ status: 'Success', data: employees });
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    const employee = await employeeServices.getEmpl(employeeId);
    if (!employee) {
      throw new AppError(
        `Employee with Id: ${employeeId} does not exist!`,
        404
      );
    }
    res.status(200).json({ status: 'Success', data: employee });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  const employeeId = req.params.id;
  const newData = helpers.filterBodyByRole(req.body, req.user.role);
  try {
    const updatedEmployee = await employeeServices.updateEmpl(
      employeeId,
      newData
    );
    res.status(200).json({ status: 'Success', data: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  const employeeId = req.params.id;
  try {
    await employeeServices.deleteEmpl(employeeId);
    res.status(200).json({ status: 'Success', data: null });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePhoto = async (req, res, next) => {
  const employeeId = req.params.id;
  if (!req.file) {
    next(new AppError('Not an image file or no file chosen!', 415));
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
    next(error);
  }
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
router.delete('/:id', middlewares.isGuest, middlewares.isHr, deleteEmployee);

module.exports = router;
