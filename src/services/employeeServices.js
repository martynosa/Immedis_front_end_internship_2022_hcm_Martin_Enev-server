const userModel = require('../config/models/userModel');
const leaveRequestModel = require('../config/models/leaveRequestModel');

const getEmpls = () => {
  return userModel
    .find({})
    .select('fullName photo department jobTitle updatedAt');
};

const getEmpl = (employeeId) =>
  userModel.findOne({ _id: employeeId }).populate('leaveRequests');

const updateEmpl = (employeeId, newData) => {
  return userModel.findOneAndUpdate({ _id: employeeId }, newData, {
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
