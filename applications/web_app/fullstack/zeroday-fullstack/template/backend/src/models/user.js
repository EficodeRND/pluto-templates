const bcrypt = require('bcryptjs');

const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('users', {
  email: { type: Sequelize.STRING, unique: true },
  role: Sequelize.STRING,
  pushToken: Sequelize.STRING,
  imageUrl: { type: Sequelize.STRING, field: 'image_url' },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  facebookId: { type: Sequelize.STRING, unique: true, field: 'facebook_id' },
  googleId: { type: Sequelize.STRING, unique: true, field: 'google_id' },
  resetPasswordToken: { type: Sequelize.STRING, field: 'reset_password_token' },
  resetPasswordExpires: { type: Sequelize.DATE, field: 'reset_password_expires' },
  password: {
    type: Sequelize.STRING,
    set(str) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(str, salt);

      this.setDataValue('password', hash);
    },
  },
});

User.prototype.passwordMatch = function cryptPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.toJSON = function formatUser() {
  return {
    id: this.id,
    imageUrl: this.imageUrl,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
    pushToken: this.pushToken,
  };
};

module.exports = User;
