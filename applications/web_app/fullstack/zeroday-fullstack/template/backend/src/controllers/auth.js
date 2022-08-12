const passport = require('koa-passport');
const { OAuth2Client } = require('google-auth-library');
const FacebookStrategy = require('passport-facebook-token');
const { Op } = require('sequelize');
const crypto = require('crypto');
const _ = require('lodash');

const oauth = require('./oauth');
const database = require('../database');
const config = require('../config');
const emailer = require('../email');
const logger = require('../logger');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await database.User.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (config.FACEBOOK_APP_ID) {
  passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
  }, async (accessToken, refreshToken, profile, done) => {
    let user = await database.User.findOne({
      where: {
        facebook_id: {
          [Op.eq]: profile.id,
        },
      },
    });

    const email = _.get(profile, 'emails[0].value');
    const imageUrl = _.get(profile, 'photos[0].value') || `https://graph.facebook.com/${profile.id}/picture?width=200&height=200`;

    if (!user && email) {
      user = await database.User.findOne({
        where: {
          email: {
            [Op.eq]: email.toLowerCase(),
          },
        },
      });
    }

    const options = {
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      imageUrl,
      locale: config.DEFAULT_LOCALE,
    };

    if (user) {
      user = await user.update(options);
      return done(null, user);
    }

    options.facebookId = profile.id;

    if (email) {
      options.email = email;
    }

    user = await database.User.create(options);
    return done(null, user);
  }));
}

/**
 * @api {post} /api/signup User sign up
 * @apiVersion 0.0.1
 * @apiName SignUp
 * @apiGroup Auth
 *
 * @apiParam {String} firstname User's first name
 * @apiParam {String} lastname User's last name
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 */
exports.signUp = async (ctx) => {
  const { body } = ctx.request;

  if (ctx.errors) {
    ctx.throw(400, 'VALIDATION_ERROR', ctx.errors);
  }

  const attributes = {
    firstname: body.firstname,
    lastname: body.lastname,
    email: body.email.toLowerCase(),
    password: body.password,
  };

  const user = database.User.build(attributes);

  try {
    await user.save();
  } catch (err) {
    ctx.throw(400, 'EMAIL_IN_USE');
  }

  await ctx.login(user);

  const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);

  ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };

  ctx.status = 201;
};

/**
 * @api {post} /api/login User login
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 */
exports.login = async (ctx) => {
  // ctx.checkBody('email').isEmail('INVALID_EMAIL');
  // ctx.checkBody('password').notEmpty('REQUIRED_FIELD');

  if (ctx.errors) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  const { body } = ctx.request;
  const user = await database.User.findOne({
    where: {
      email: {
        [Op.eq]: body.email.toLowerCase(),
      },
    },
  });

  if (!user) {
    ctx.throw(401, 'ACCESS_DENIED');
  }

  const match = user.passwordMatch(body.password);
  if (!match) {
    ctx.throw(401, 'ACCESS_DENIED');
  }

  await ctx.login(user);

  const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);

  ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };

  ctx.status = 200;
};

/**
 * @api {post} /api/request_password_change Request password change
 * @apiVersion 0.0.1
 * @apiName PostRequestPasswordChange
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email
 *
 */
exports.requestPasswordChange = async (ctx) => {
  // ctx.checkBody('email').isEmail('INVALID_EMAIL');

  if (ctx.errors) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  const { body } = ctx.request;
  const user = await database.User.findOne({
    where: {
      email: {
        [Op.eq]: body.email.toLowerCase(),
      },
    },
  });

  if (user) {
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    const tokenValidMilliseconds = 1000 * 60 * 15;
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + tokenValidMilliseconds,
    });
    const mailOptions = {
      from: user.email,
      to: user.email,
      subject: 'Password change requested',
      template: 'forgot-password-email',
      context: {
        url: `${config.FRONTEND}/resetpassword/${token}`,
        name: `${user.firstname} ${user.lastname}`,
      },
    };

    try {
      await emailer.sendEmail(mailOptions);
    } catch (err) {
      ctx.throw(500, 'EMAIL_ERROR');
    }
  } else {
    // User not found, but don't tell user if email exists in the database
    ctx.status = 204;
  }

  ctx.status = 204;
};

/**
 * @api {post} /api/reset_password Reset password with token
 * @apiVersion 0.0.1
 * @apiName PostResetPassword
 * @apiGroup Auth
 *
 * @apiParam {String} token Reset token
 * @apiParam {String} newPassword New password
 * @apiParam {String} verifyPassword Verification for new password
 *
 */
exports.resetPassword = async (ctx) => {
  if (ctx.errors) {
    ctx.throw(400, 'VALIDATION_ERROR');
  }

  const { body } = ctx.request;

  if (!body.newPassword || body.newPassword !== body.verifyPassword) {
    ctx.throw(400, 'PASSWORD_VERIFICATION_ERROR');
  }

  if (!body.token) {
    ctx.throw(401, 'INVALID_TOKEN');
  }

  const user = await database.User.findOne({
    where: {
      resetPasswordToken: body.token,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });

  if (user) {
    await user.update({
      password: body.newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    const mailOptions = {
      from: user.email,
      to: user.email,
      subject: 'Password has been changed',
      template: 'reset-password-email',
      context: {
        name: `${user.firstname} ${user.lastname}`,
      },
    };

    try {
      await emailer.sendEmail(mailOptions);
    } catch (err) {
      ctx.throw(500, 'EMAIL_ERROR');
    }
  } else {
    ctx.throw(401, 'INVALID_TOKEN');
  }

  ctx.status = 204;
};

/**
 * @api {post} /api/facebook/signin Login through Facebook account
 * @apiVersion 0.0.1
 * @apiName SignInFacebook
 * @apiGroup Auth
 *
 * @apiParam {String} access_token Facebook access token
 * @apiParam {String} [ refresh_token ] Facebook refresh token
 */

exports.facebookSignIn = async (ctx) => {
  if (!config.FACEBOOK_APP_ID) {
    logger.error('ERROR: FACEBOOK_APP_ID is empty.');
    ctx.throw(500, 'Internal server error.');
  } else {
    await passport.authenticate('facebook-token').call(this, ctx, async () => {
      const { user } = ctx.state;

      const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);

      ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };
      ctx.status = 200;
    });
  }
};

/**
 * @api {post} /api/google/signin Login through Google account
 * @apiVersion 0.0.1
 * @apiName SignInGoogle
 * @apiGroup Auth
 *
 * @apiParam {String} access_token Google access token
 * @apiParam {String} [ refresh_token ] Google refresh token
 */

exports.googleSignIn = async (ctx) => {
  if (!config.GOOGLE_OAUTH_ID) {
    logger.error('ERROR: GOOGLE_OAUTH_ID is empty.');
    ctx.throw(500, 'Internal server error.');
  } else {
    const client = new OAuth2Client(config.GOOGLE_OAUTH_ID);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: ctx.request.body.access_token
      });
    } catch(e) {
      ctx.throw(401, 'Token validation failed.');
    }

    const payload = ticket.getPayload();
    const userid = payload.sub;
    const email = payload.email;

    let user = await database.User.findOne({
      where: {
        google_id: {
          [Op.eq]: userid,
        },
      },
    });

    if (!user) {
      user = await database.User.findOne({
        where: {
          email: {
            [Op.eq]: email.toLowerCase(),
          },
        },
      });
    }

    const options = {
      firstname: payload.given_name,
      lastname: payload.family_name,
      imageUrl: payload.picture,
      locale: config.DEFAULT_LOCALE,
    };

    if (user) {
      user = await user.update(options);
    } else {
      options.googleId = userid;
      options.email = email;
      user = await database.User.create(options);
    }

    const { accessToken } = await oauth.generateTokens(user.toJSON(), config.SECRET);
    ctx.body = { ...user.toJSON(), email: user.email, token: accessToken };
    ctx.status = 200;
  }
};

/**
 * @api {post} /api/logout Logout current authenticated user
 * @apiVersion 0.0.1
 * @apiName Logout
 * @apiGroup Auth
 */
exports.logout = (ctx) => {
  ctx.logout();
  ctx.status = 204;
};

/**
 * @api {get} /users/me Current User Info
 * @apiVersion 0.0.1
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiPermission user
 *
 */
exports.current = async (ctx) => {
  const user = await database.User.findOne({
    where: {
      id: {
        [Op.eq]: ctx.state.user.id,
      },
    },
  });

  ctx.body = { ...user.toJSON(), email: user.email };
};

exports.authenticatedMiddleware = async (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    ctx.throw(401, 'UNAUTHORIZED');
  }
  await next;
};
