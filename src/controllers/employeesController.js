const express = require('express');
const middlewares = require('../services/middlewares');
const mongoErrorHandler = require('../services/errorServices');
const userModel = require('../config/models/userModel');

const router = express.Router();

const getEmployees = async (req, res) => {
  try {
    const employees = await userModel
      .find({})
      .select('fullName photo department jobTitle');
    res.status(200).json({ status: 'Success', data: employees });
  } catch (error) {
    const message = mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

const getEmployee = async (req, res) => {
  if (req.user.role !== 'hr') {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Not authorized!' });
  }

  const employeeId = req.params.id;
  try {
    const employee = await userModel.findById(employeeId);
    res.status(200).json({ status: 'Success', data: employee });
  } catch (error) {
    const message = mongoErrorHandler(error);
    res.status(500).json({ status: 'Error', message });
  }
};

// both hr & employees
router.get('/', middlewares.isGuest, getEmployees);
// router.get('/myProfile', middlewares.isGuest, getMyProfile);

//for HR
router.get('/:id', middlewares.isGuest, getEmployee);
// router.delete('/:id', middlewares.isGuest, itemDelete);
// router.put('/:id', middlewares.isGuest, itemUpdate);

module.exports = router;

module.exports = router;
