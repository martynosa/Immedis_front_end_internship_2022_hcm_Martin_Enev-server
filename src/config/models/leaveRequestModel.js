const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'message is required!'],
    },
    from: {
      type: Date,
      required: [true, 'from date is required!'],
    },
    to: {
      type: Date,
      required: [true, 'to date is required!'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Valid types: pending, approved, rejected!',
      },
      default: 'pending',
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: [true, 'ownerId is required!'],
    },
  },
  { timestamps: true }
);

const leaveRequestModel = mongoose.model('leaveRequest', leaveRequestSchema);

module.exports = leaveRequestModel;
