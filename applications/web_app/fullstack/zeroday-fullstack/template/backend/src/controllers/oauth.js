const jwt = require('jsonwebtoken');

const config = require('../config');

const generateTokens = async (payload, secret) => {
  try {
    const refreshToken = jwt.sign(
      { id: payload.id },
      secret,
      { expiresIn: config.REFRESH_TOKEN_TTL },
    );
    const accessToken = jwt.sign(payload, secret, { expiresIn: config.ACCESS_TOKEN_TTL });

    return Promise.resolve({
      accessToken,
      refreshToken,
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = { generateTokens };
