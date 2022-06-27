const filterBody = (body, allowedKeys) => {
  const entries = Object.entries(body);
  filteredEntries = entries.filter((en) => allowedKeys.includes(en[0]));
  const filteredBody = Object.fromEntries(filteredEntries);
  console.log(filteredBody);

  return filteredBody;
};

const helpers = {
  filterBody,
};

module.exports = helpers;
