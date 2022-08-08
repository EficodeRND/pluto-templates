const { Op } = require('sequelize');
const oauth = require('./oauth');

const database = require('../database');
const form = require('../form');

const config = require('../config');

/**
 * @api {get} /users/:id  Get basic user info
 * @apiVersion 0.0.1
 * @apiName GetUser
 * @apiGroup Users
 * @apiPermission user
 *
 * @apiParam {String} id user identity
 */
exports.get = async (ctx) => {
  const user = await database.User.findOne({
    where: {
      id: {
        [Op.eq]: ctx.params.id,
      },
    },
  });

  if (ctx.errors || !user) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  ctx.body = user.toJSON();
  ctx.status = 200;
};

/**
 * @api {post} /users  Update personal info
 * @apiVersion 0.0.1
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiPermission user
 *
 */
exports.update = async (ctx) => {
  const user = await database.User.findOne({
    where: {
      id: {
        [Op.eq]: ctx.state.user.id,
      },
    },
  });

  if (ctx.errors || !user) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  const attributes = form(ctx.request.body, ['description', 'pushToken', 'firstname', 'lastname', 'email']);

  try {
    await user.update(attributes);
  } catch (err) {
    ctx.throw(400, 'SAVING_ERROR');
  }

  const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);

  ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };

  ctx.status = 200;
};

/**
 * @api {post} /register  Register user
 * @apiVersion 0.0.1
 * @apiName RegisterUser
 * @apiGroup Users
 * @apiPermission user
 *
 */
exports.register = async (ctx) => {
  const user = await database.User.findOne({
    where: {
      id: {
        [Op.eq]: ctx.state.user.id,
      },
    },
  });

  if (ctx.errors || !user) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  try {
    await user.update({ tosAccepted: true });
  } catch (err) {
    ctx.throw(400, 'SAVING_ERROR');
  }

  const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);

  ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };

  ctx.status = 200;
};
