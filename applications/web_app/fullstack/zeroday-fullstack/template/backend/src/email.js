const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

const logger = require('./logger');
const { NODEMAILER_SMTP_HOST, NODEMAILER_USER, NODEMAILER_PASS } = require('./config');

// Nodemailer also supports various other transport options and well-known services and OAuth2
// see https://nodemailer.com/smtp/well-known/ and https://nodemailer.com/transports/
const transportConfig = {
  host: NODEMAILER_SMTP_HOST,
  secure: true,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
};

const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./src/templates/'),
  extName: '.html',
};

function verifyNodemailerConfig(conf) {
  let ok = true;
  if (!conf.host || conf.host === 0) {
    logger.error('Nodemailer host configuration missing.');
    ok = false;
  }
  if (!conf.auth.user || conf.auth.user === 0) {
    logger.error('Nodemailer user configuration missing.');
    ok = false;
  }
  if (!conf.auth.pass || conf.auth.pass === 0) {
    logger.error('Nodemailer password configuration missing.');
    ok = false;
  }

  return ok;
}

let transporter;
if (process.env.NODE_ENV !== 'test' && !verifyNodemailerConfig(transportConfig)) {
  logger.error('Nodemailer configuration incomplete');
}

try {
  transporter = nodemailer.createTransport(transportConfig);
  transporter.use('compile', hbs(handlebarsOptions));
} catch (error) {
  logger.error('Error initializing nodemailer', { error });
}

module.exports.sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Error sending email', { error });
    throw new Error(`Error sending email ${error ? JSON.stringify(error) : ''}`);
  }
};
