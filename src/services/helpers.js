const mongoErrorHandler = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message);
    return `Invalid input data. ${errors.join(' ')}`;
  }

  if (error.name === 'CastError') {
    return `Invalid ${error.path}: ${error.value}.`;
  }

  if (error.code === 11000) {
    return `${Object.values(error.keyValue)} already exists!`;
  }

  return process.env.NODE_ENV === 'production'
    ? 'General error, please try again later.'
    : error;
};

const filterBodyByRole = (body, role) => {
  const entries = Object.entries(body);
  const employee = ['fullName', 'gender', 'birthDate', 'phone', 'address'];
  const hr = [
    'fullName',
    'gender',
    'birthDate',
    'phone',
    'address',
    'entryDate',
    'employmentType',
    'jobTitle',
    'salary',
  ];

  role === 'hr'
    ? (filteredEntries = entries.filter((en) => hr.includes(en[0])))
    : (filteredEntries = entries.filter((en) => employee.includes(en[0])));

  return Object.fromEntries(filteredEntries);
};

const leaveDaysCalc = (from, to) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return (new Date(to) - new Date(from)) / oneDay;
};

const helpers = {
  filterBodyByRole,
  mongoErrorHandler,
  leaveDaysCalc,
};

module.exports = helpers;
