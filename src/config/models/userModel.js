const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
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
      required: [true, 'Full name is required!'],
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
  },
  { timestamps: true }
);

userSchema.virtual('employeeFor').get(function () {
  // calculate dates here
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
