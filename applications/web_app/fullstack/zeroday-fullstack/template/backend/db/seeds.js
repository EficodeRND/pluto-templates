const db = require('../src/database');
const logger = require('../src/logger');

const create = async () => {
  try {
    await db.sync({ force: true });
    await db.User.create({
      firstname: 'Jalmari', lastname: 'Pipo', email: 'jalmari.pipo@eficode.com.invalid', password: 'test1234',
    });
    /* Exit the process explicitly to avoid freezing */
    logger.info('Seeds generated');
    process.exit(0);
  } catch (error) {
    logger.error('Error: Can\'t generate seeds', { error });
    process.exit(1);
  }
};

create();
