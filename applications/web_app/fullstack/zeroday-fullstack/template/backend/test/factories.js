const _ = require('lodash');
const database = require('../src/database');

let i = 0;

const email = () => {
  i += 1;
  return `test${i}@test.com`;
};

const password = () => {
  i += 1;
  return `test${i}`;
};

const user = async (options) => {
  const opts = _.merge({
    email: email(),
    password: password(),
  }, options);

  return database.User.create(opts);
};

module.exports = {
  email,
  user,
};
