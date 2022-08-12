const methods = require('methods');
const TestAgent = require('supertest').agent;
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

mockery.enable({
  warnOnUnregistered: false,
});
mockery.registerMock('nodemailer', nodemailerMock);

const app = require('../src/app');

function Agent(application) {
  TestAgent.call(this, application);
  this.token = null;
}

/* TODO: refactor this no not abuse the deprecated __proto__ */
Agent.prototype.__proto__ = TestAgent.prototype; // eslint-disable-line no-proto

methods.forEach((method) => {
  Agent.prototype[method] = function createApiRequest(url, fn) {
    const apiUrl = url;

    const req = TestAgent.prototype[method].call(this, apiUrl, fn);

    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }

    /* eslint-disable consistent-return */
    return req.expect((res) => {
      if (res.status === 204) { return; }
      if (res.type !== 'application/json') {
        return `All API endpoints must return a valid JSON or 204. Content type: ${res.type}`;
      }
    });
    /* eslint-enable consistent-return */
  };
});

Agent.prototype.setAuthToken = function setToken(token) {
  this.token = token;
};

Agent.prototype.resetAuthToken = function resetToken() {
  this.token = null;
};

Agent.prototype.del = Agent.prototype.delete;

module.exports = function createAgent() {
  return new Agent(app.listen());
};
