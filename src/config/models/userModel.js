const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Username is required!'],
    validate: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Invalid email address!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: [6, 'Password with 6 or more characters required!'],
  },
  rePassword: {
    type: String,
    required: [true, 'Repeat Password is required!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and Repeat password must be identical!',
    },
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  fullName: {
    type: String,
    required: [true, 'First name is required!'],
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: 'Valid genders: male, female!',
    },
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  JobTitle: {
    type: String,
  },
  department: {
    type: String,
  },
  employmentType: {
    type: String,
    enum: {
      values: ['intern', 'fullTime', 'partTime'],
      message: 'Valid types: intern, fullTime, partTime!',
    },
  },
  salary: {
    type: Number,
    validate: [
      (salary) => {
        return salary > 0;
      },
      'Salary must be positive number!',
    ],
  },
  entry: {
    type: Date,
  },
  remainingLeave: {
    type: Number,
    default: 25,
  },
  leaveHistory: {
    type: Object,
  },
  role: {
    type: String,
    enum: {
      values: ['hr', 'employee'],
      message: 'Valid roles: hr, employee!',
    },
  },
});

userSchema.virtual('annualSalary').get(function () {
  return this.salary * 12;
});

//hashes the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.rePassword = undefined;
  next();
});

//validates the password
userSchema.method('validatePassword', function (password) {
  return bcrypt.compare(password, this.password);
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
