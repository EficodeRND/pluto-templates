const assert = require('assert');

const database = require('../src/database');

const helpers = require('./test-helpers');
const factories = require('./factories');

const agent = require('./agent')();

describe('User', () => {
  before(async () => {
    await database.sync({ force: true });
  });

  beforeEach(async () => {
    await helpers.logout(agent);
  });

  it('should get personal user information', async () => {
    const user = await helpers.login(agent);

    const response = await agent.get('/api/users/me').expect(200);

    assert.strictEqual(response.body.email, user.email);
  });

  it('should save push token for user', async () => {
    await helpers.login(agent);

    const response = await agent.put('/api/users').send({ pushToken: 'my-push-token-12345' }).expect(200);

    assert.strictEqual(response.body.pushToken, 'my-push-token-12345');
  });

  it('should get other user information', async () => {
    await helpers.login(agent);

    const otherUser = await factories.user();

    const response = await agent.get(`/api/users/${otherUser.id}`).expect(200);

    assert.strictEqual(response.body.firstname, otherUser.firstname);
    assert.strictEqual(response.body.email, otherUser.email);
  });
});
