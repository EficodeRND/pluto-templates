const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const passport = require('koa-passport');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const cors = require('kcors');

const config = require('./config');
const auth = require('./controllers/auth');
const users = require('./controllers/users');
const messagers = require('./messagers/messagers');
const logger = require('./logger');

const app = new Koa();

const log = (ctx, next) => { // Log requests with context
  logger.info('', { ctx });
  return next();
};

app.use(async (ctx, next) => { // Log response errors
  try {
    await next();
  } catch (error) {
    if (error.status >= 500) {
      logger.error(`ERROR ${error.status}`, { error });
    } else {
      logger.debug(`ERROR ${error.status}`, { error });
    }
    throw error; // Throw error again, so the Koa error handler can take care of it
  }
});

if (!process.env.SILENT) {
  app.use(koaLogger());
}
app.use(cors());
app.use(bodyParser());

app.keys = config.KEYS;

app.use(passport.initialize());
app.use(passport.session());

const publicRouter = new Router({ prefix: '/api' });
publicRouter.use(log);
publicRouter.post('/login', auth.login);
publicRouter.post('/logout', auth.logout);
publicRouter.post('/signup', auth.signUp);
publicRouter.post('/facebook/signin', auth.facebookSignIn);
publicRouter.post('/google/signin', auth.googleSignIn);
publicRouter.post('/request_password_change', auth.requestPasswordChange);
publicRouter.post('/reset_password', auth.resetPassword);

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

const messagerRouter = new Router({ prefix: '/api' });

messagerRouter.all('/hello', messagers.hello);

app.use(messagerRouter.routes());
app.use(messagerRouter.allowedMethods());

app.use(jwt({ secret: config.SECRET, debug: true }));

const privateRouter = new Router({ prefix: '/api' });
privateRouter.use(log);

privateRouter.get('/users/me', auth.current);
privateRouter.get('/users/:id', users.get);
privateRouter.put('/users', users.update);

app.use(privateRouter.routes());
app.use(privateRouter.allowedMethods());

module.exports = app;
