const express = require('express');
const employeeServices = require('../services/employeeServices');
const middlewares = require('../services/middlewares');
const userModel = require('../config/models/userModel');
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
  let newData = helpers.filterBodyByRole(req.body, req.user.role);
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

const profilePhoto = async (req, res) => {
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
    console.log(error);
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

router.get('/', middlewares.isGuest, getEmployees);
router.post(
  '/:id/uploadPhoto',
  middlewares.isGuest,
  middlewares.isAuthorized,
  multerServices.uploadProfilePhoto,
  multerServices.resizeProfilePhoto,
  profilePhoto
);
router.get('/:id', middlewares.isGuest, middlewares.isAuthorized, getEmployee);
router.put(
  '/:id',
  middlewares.isGuest,
  middlewares.isAuthorized,
  updateEmployee
);
router.delete('/:id', middlewares.isGuest, middlewares.isHR, deleteEmployee);

module.exports = router;
