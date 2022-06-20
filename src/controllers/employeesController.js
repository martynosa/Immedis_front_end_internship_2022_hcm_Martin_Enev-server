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

// both hr & employees
router.get('/', middlewares.isGuest, getEmployees);
// router.get('/myProfile', middlewares.isGuest, getMyProfile);

//for HR
// router.get('/:id', middlewares.isGuest, getSingleItem);
// router.delete('/:id', middlewares.isGuest, itemDelete);
// router.put('/:id', middlewares.isGuest, itemUpdate);

module.exports = router;

module.exports = router;
