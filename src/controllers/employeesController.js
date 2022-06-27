const express = require('express');
const middlewares = require('../services/middlewares');
const userModel = require('../config/models/userModel');
const helpers = require('../services/helpers');

const router = express.Router();

const getEmployees = async (req, res) => {
  try {
    const employees = await userModel
      .find({})
      .select('fullName photo department jobTitle');
    res.status(200).json({ status: 'Success', data: employees });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const getEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const employee = await userModel.findById(employeeId);
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
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: employeeId },
      newData,
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'Success', data: updatedUser });
  } catch (error) {
    const message = helpers.mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const deleteEmployee = (req, res) => {
  console.log('deleted');
  res.status(200).json({ status: 'Success', data: null });
};

// both hr & employees
router.get('/', middlewares.isGuest, getEmployees);
// router.get('/myProfile', middlewares.isGuest, getMyProfile);

//for HR
router.get('/:id', middlewares.isGuest, middlewares.isAuthorized, getEmployee);
router.put(
  '/:id',
  middlewares.isGuest,
  middlewares.isAuthorized,
  updateEmployee
);
router.delete('/:id', middlewares.isGuest, middlewares.isHR, deleteEmployee);

module.exports = router;

module.exports = router;
