const assert = require('assert');
const nodemailerMock = require('nodemailer-mock');
const _ = require('lodash');
const database = require('../src/database');
const config = require('../src/config'); // eslint-disable-line
const helpers = require('./test-helpers');
const agent = require('./agent')();

describe('Authorization', () => {
  before(async () => {
    await database.sync({ force: true });
  });

  afterEach(() => {
    nodemailerMock.mock.reset();
  });

  it('should signup a new user', async () => {
    const response = await helpers.signup(agent);

    assert(_.isString(response.body.token));
  });

  it('should send a password reset email', async () => {
    const user = await helpers.login(agent);
    await agent.post('/api/request_password_change').send({ email: user.email }).expect(204);
    const sentMail = nodemailerMock.mock.sentMail();

    assert.strictEqual(sentMail.length, 1);
    const regex = /.*resetpassword\/(.*)$/g;
    const { url } = sentMail[0].context;
    const token = regex.exec(url)[1];
    assert(token);
    assert(token.length > 20);
  });

  it('should not send reset token to email not in database', async () => {
    await agent.post('/api/request_password_change').send({ email: 'not.in.database@test.com' }).expect(204);
    assert.strictEqual(nodemailerMock.mock.sentMail().length, 0);
  });

  it('should change password with reset token', async () => {
    const user = await helpers.login(agent);
    await agent.post('/api/request_password_change').send({ email: user.email }).expect(204);
    const regex = /.*resetpassword\/(.*)$/g;
    const token = regex.exec(nodemailerMock.mock.sentMail()[0].context.url)[1];
    assert(token);
    assert(token.length > 20);
    await agent.post('/api/reset_password').send({ token, newPassword: 'monkeyBarrel2000!', verifyPassword: 'monkeyBarrel2000!' }).expect(204);
  });

  it('should login after password reset', async () => {
    const user = await helpers.login(agent);
    await agent.post('/api/request_password_change').send({ email: user.email }).expect(204);
    const regex = /.*resetpassword\/(.*)$/g;
    const token = regex.exec(nodemailerMock.mock.sentMail()[0].context.url)[1];
    await agent.post('/api/reset_password').send({ token, newPassword: 'monkeyBarrel2000!', verifyPassword: 'monkeyBarrel2000!' }).expect(204);

    await agent.post('/api/login').send({ email: user.email, password: 'monkeyBarrel2000!' }).expect(200);
  });

  it('should not reset password with an invalid token', async () => {
    await agent.post('/api/reset_password').send({ token: 'ThisTokenIsGarbage', newPassword: 'monkeyBarrel2000!', verifyPassword: 'monkeyBarrel2000!' }).expect(401);
  });

  it('should not reset password without correct verification', async () => {
    await agent.post('/api/reset_password').send({ token: 'ThisTokenIsGarbage', newPassword: 'monkeyBarrel2000!', verifyPassword: 'doesnotmatch!' }).expect(400);
  });

  it('should not reset password with an empty token', async () => {
    await agent.post('/api/reset_password').send({ token: undefined, newPassword: 'monkeyBarrel2000!', verifyPassword: 'monkeyBarrel2000!' }).expect(401);
  });
});

/*
describe('Facebook Login', () => {
  var testUsers = {
    '106703763266783': {
      name: 'Dave Alaghadgicfee Valtchanovwitz',
      email: 'rmknpulqlu_1496817297@tfbnw.net',
    },
    '102386193701630': {
      name: 'Will Alagijgdhedfg Fergiewitz',
      email: 'pxygsppwyt_1496817296@tfbnw.net',
    },
  };

  before(async () => {
    var host = 'https://graph.facebook.com/';
    var appId = config.FACEBOOK_APP_ID;
    var appSecret = config.FACEBOOK_APP_SECRET;

    var appToken = await (new Promise((resolve) => {
      request(`${host}oauth/access_token?
        client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`,
        (error, res, body) => {
          if (!error && res.statusCode === 200) {
            var result = JSON.parse(body);

            if (_.isNull(result.access_token)) {
            throw `Could not get facebook app token: ${res + '\n' + body}`;
            }
            resolve(result.access_token);
          } else {
            throw 'Facebook request failed ' + error;
          }
        }
      );
    }));

    var testUserData = await (new Promise((resolve) => {
      request(host + appId + '/accounts/test-users/?access_token=' + appToken,
        (error, res, body) => {
          if (!error && res.statusCode === 200) {
            resolve(JSON.parse(body));
          } else {
            throw 'Facebook request failed ' + error;
          }
        }
      );
    }));

    for (var testUser of testUserData.data) {
      if (testUsers[testUser.id]) {
        testUsers[testUser.id].token = testUser.access_token;
      }
    }
  });

  it('should create new user and re-login', async () => {
    var fbId = '106703763266783';
    var testUser = testUsers[fbId];

    var response = await agent.post('/api/facebook/signin')
    .send({access_token: testUser.token})
    .expect(200);

    var token = 'Bearer ' + response.body.token;
    var me = await agent.get('/api/users/me').set('Authorization', token).expect(200);

    // assert(me.body.facebookId === fbId);
    assert(me.body.email === testUser.email);

    await agent.post('/api/logout').set('Authorization', token).expect(204);

    response = await agent.post('/api/facebook/signin')
    .send({access_token: testUser.token})
    .expect(200);
    token = 'Bearer ' + response.body.token;
    var me2 = await agent.get('/api/users/me').set('Authorization', token).expect(200);
    assert(me.body.id === me2.body.id);
  });

  it('should be able to login to existing account', async () => {
    var fbId = '102386193701630';
    var testUser = testUsers[fbId];

    var user = await database.User.create({ email: testUser.email, password: 'test' });

    var response = await agent.post('/api/facebook/signin')
    .send({access_token: testUser.token})
    .expect(200);

    var token = 'Bearer ' + response.body.token;
    var me = await agent.get('/api/users/me').set('Authorization', token).expect(200);

    assert(me.body.id === user.id);
  });
});
*/
