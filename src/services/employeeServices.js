const userModel = require('../config/models/userModel');
const leaveRequestModel = require('../config/models/leaveRequestModel');

const getEmpls = () => {
  return userModel
    .find({})
    .select('fullName photo employmentType jobTitle updatedAt');
};

const getEmpl = (employeeId) =>
  userModel.findById(employeeId).populate('leaveRequests');

const updateEmpl = (employeeId, newData) => {
  return userModel.findByIdAndUpdate(employeeId, newData, {
    new: true,
    runValidators: true,
  });
};

const deleteEmpl = async (employeeId) => {
  await userModel.findByIdAndDelete(employeeId);
  await leaveRequestModel.deleteMany({ ownerId: employeeId });
};

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
