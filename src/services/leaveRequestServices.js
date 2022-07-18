const leaveRequestModel = require('../config/models/leaveRequestModel');
const userModel = require('../config/models/userModel');

const createLr = async (lr) => {
  const newLr = await leaveRequestModel.create(lr);
  let employee = await userModel.findById(lr.ownerId).populate('leaveRequests');
  employee.leaveRequests.push(newLr);
  employee.save({ validateBeforeSave: false });
  return employee;
};

const patchLr = async ({ _id, status }) => {
  // update lr
  let lr = await leaveRequestModel.findById(_id);
  if (lr.status !== 'pending')
    throw 'Leave has already been approved or rejected!';
  lr.status = status;

  // update user
  if (status === 'approved') {
    let employee = await userModel
      .findById(lr.ownerId)
      .populate('leaveRequests');
    if (employee.remainingLeave < lr.days)
      throw 'Not enough leave days remaining!';
    employee.remainingLeave -= lr.days;
    lr.save();
    employee.save({ validateBeforeSave: false });
    employee.leaveRequests.forEach((lr) => {
      if (lr._id == _id) lr.status = status;
    });
    return employee;
  }

  lr.save();
  return userModel.findById(lr.ownerId).populate('leaveRequests');
};

const leaveRequestServices = {
  createLr,
  patchLr,
};

module.exports = leaveRequestServices;
