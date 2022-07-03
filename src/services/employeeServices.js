const userModel = require('../config/models/userModel');

const getEmpls = () => {
  return userModel
    .find({})
    .select('fullName photo department jobTitle updatedAt');
};

const getEmpl = (employeeId) => userModel.findById(employeeId);

const updateEmpl = (employeeId, newData) => {
  return userModel.findOneAndUpdate({ _id: employeeId }, newData, {
    new: true,
    runValidators: true,
  });
};

const deleteEmpl = (employeeId) => userModel.findByIdAndDelete(employeeId);

const updatePhotoEmpl = (employeeId, newPhoto) =>
  userModel.findByIdAndUpdate(
    employeeId,
    {
      photo: newPhoto,
    },
    { new: true }
  );
const employeeServices = {
  getEmpls,
  getEmpl,
  updateEmpl,
  deleteEmpl,
  updatePhotoEmpl,
};

module.exports = employeeServices;
