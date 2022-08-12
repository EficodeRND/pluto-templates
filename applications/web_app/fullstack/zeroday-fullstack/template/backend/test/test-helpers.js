const factories = require('./factories');

module.exports = {
  signup: async (agent, user, password = 'test') => {
    const response = await agent.post('/api/signup').send({
      email: factories.email(),
      password,
    });

    return response;
  },

  login: async (agent, user, password = 'test') => {
    const userObject = user || await factories.user({ password });

    const response = await agent.post('/api/login').send({
      email: userObject.email,
      password,
    });

    agent.setAuthToken(response.body.token);

    return userObject;
  },

  logout: async (agent) => {
    await agent.post('/api/logout');
    agent.resetAuthToken();
  },
};
