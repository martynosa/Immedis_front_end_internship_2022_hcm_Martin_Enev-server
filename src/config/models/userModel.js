const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required!'],
      validate: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Invalid email address!'],
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      minlength: [6, 'Password with 6 or more characters required!'],
    },
    rePassword: {
      type: String,
      required: [true, 'rePassword is required!'],
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
      required: [true, 'fullName is required!'],
      minlength: [3, 'Full name with 3 or more characters required!'],
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
      validate: [
        (phone) => {
          if (/\D/g.test(phone)) return false;
          return phone.length === 10 || phone.length === 0;
        },
        'Phone number with 10 digits required!',
      ],
    },
    address: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    department: {
      type: String,
      enum: {
        values: ['Management', 'Accounting', 'Sales', 'IT'],
        message: 'Valid types: Management, Accounting, Sales, IT!',
      },
    },
    employmentType: {
      type: String,
      enum: {
        values: ['Intern', 'Full time', 'Part time'],
        message: 'Valid types: Intern, Full time, Part time!',
      },
    },
    salary: {
      type: Number,
      default: 0,
      validate: [
        (salary) => {
          return salary >= 0;
        },
        'Salary must be equal to 0 or higher!',
      ],
    },
    entryDate: {
      type: Date,
    },
    remainingLeave: {
      type: Number,
      default: 25,
    },
    leaveRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'leaveRequest',
      },
    ],
    role: {
      type: String,
      enum: {
        values: ['hr', 'employee'],
        message: 'Valid roles: hr, employee!',
      },
      required: [true, 'role is required!'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('yearsOld').get(function () {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((new Date() - this.birthDate) / oneDay / 365);
});

//hashes the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.rePassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // fix department issue
});

//validates the password
userSchema.method('validatePassword', function (password) {
  return bcrypt.compare(password, this.password);
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
