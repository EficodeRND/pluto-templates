const { createLogger, format, transports } = require('winston');
const { LOGGING, LOG_LEVEL, LOG_FILE_LOCATION } = require('./config');

const formatContext = format((info) => {
  if (!info.ctx) return info;

  const { ctx, ...otherInfo } = info;

  const bodyValues = () => {
    if (!ctx.request.body) return {};

    const {
      password, token, pushToken, ...values
    } = ctx.request.body;
    return values;
  };

  return {
    ...otherInfo,
    ip: ctx.ip,
    method: ctx.method,
    url: ctx.url,
    user: ctx.state.user ? ctx.state.user.id : null,
    body: bodyValues(),
  };
});

const logger = createLogger({
  silent: !LOGGING,
});

logger.add(new transports.Console({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    formatContext(),
    format.simple(),
  ),
}));

if (LOG_FILE_LOCATION) {
  logger.add(new transports.File({
    filename: LOG_FILE_LOCATION,
    level: LOG_LEVEL,
    format: format.combine(
      format.timestamp(),
      formatContext(),
      format.json(),
    ),
  }));
}

module.exports = logger;
