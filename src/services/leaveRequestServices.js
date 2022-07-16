const leaveRequestModel = require('../config/models/leaveRequestModel');
const userModel = require('../config/models/userModel');

const createLr = async (lr) => {
  const newLr = await leaveRequestModel.create(lr);
  return userModel
    .findByIdAndUpdate(
      { _id: lr.ownerId },
      { $push: { leaveRequests: newLr._id } },
      { new: true, runValidators: true }
    )
    .populate('leaveRequests');
};

const patchLr = async ({ _id, status }) => {
  const newLr = await leaveRequestModel.findByIdAndUpdate(
    _id,
    { status },
    { new: true, runValidators: true }
  );
  return userModel.findById(newLr.ownerId).populate('leaveRequests');
};

const leaveRequestServices = {
  createLr,
  patchLr,
};

module.exports = leaveRequestServices;
