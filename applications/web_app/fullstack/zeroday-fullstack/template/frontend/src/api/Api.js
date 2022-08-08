import * as types from '../actions/actionTypes';
import { environment } from '../utils/environmentUtils';

const loginFailure = (error) => ({ type: types.LOGIN_FAILURE, payload: error });

const getHeaders = async () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (user) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  return headers;
};

const url = environment.ENDPOINT
  ? environment.ENDPOINT
  : `${window.location.protocol}//${window.location.host}/api`;

class Api {
  config = { baseURL: url };

  dispatch = null;

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    if (response.status === 401) {
      localStorage.removeItem('user');
      this.dispatch(loginFailure(response.error));
    }

    throw new Error(response.statusText);
  }

  async get(uri) {
    const response = await fetch(`${this.config.baseURL}${uri}`, { headers: await getHeaders() });

    this.checkStatus(response);

    return response.json();
  }

  async post(uri, params = {}) {
    console.log(`POST to ${this.config.baseURL}${uri}`);

    const response = await fetch(`${this.config.baseURL}${uri}`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(params),
    });

    this.checkStatus(response);

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async put(uri, params = {}) {
    const response = await fetch(`${this.config.baseURL}${uri}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(params),
    });

    this.checkStatus(response);

    return response.json();
  }
}

export default Api;
