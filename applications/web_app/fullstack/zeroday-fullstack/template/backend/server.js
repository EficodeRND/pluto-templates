const app = require('./src/app');
const db = require('./src/database');
const logger = require('./src/logger');

const port = process.env.PORT || 9000;

db.sync().then(() => {
  app.listen(port);
});

logger.info(`App listening on port ${port}`);
