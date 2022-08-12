const sequelize = require('./models/sequelize');

exports.User = require('./models/user');

exports.sync = (options) => sequelize.sync(options);

exports.transaction = (options) => sequelize.transaction(options);
