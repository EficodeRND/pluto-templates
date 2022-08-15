import * as types from './actionTypes';

const signupSuccess = (data) => ({ type: types.SIGNUP_SUCCESS, payload: data });
const signupFailure = (error) => ({ type: types.SIGNUP_FAILURE, payload: error });
const loginSuccess = (user) => ({ type: types.LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: types.LOGIN_FAILURE, payload: error });

const requestPasswordChangeSuccess = (response) => ({
  type: types.REQUEST_PASSWORD_CHANGE_SUCCESS,
  payload: response,
});
const requestPasswordChangeFailure = (error) => ({
  type: types.REQUEST_PASSWORD_CHANGE_FAILURE,
  payload: error,
});

const resetPasswordSuccess = (response) => ({
  type: types.RESET_PASSWORD_SUCCESS,
  payload: response,
});
const resetPasswordFailure = (error) => ({ type: types.RESET_PASSWORD_FAILURE, payload: error });

const getErrorMessage = (error) => ((error.response) ? error.response.dataMessage : error.message);

const logoutSuccess = () => ({ type: types.LOGOUT_SUCCESS });
const logoutFailure = (error) => ({ type: types.LOGOUT_FAILURE, payload: error });

export const clearUserNotification = () => ({ type: types.CLEAR_AUTH_MESSAGE });

export const loginWithFacebook = () => async (dispatch, getState, api) => {
  window.FB.login(async (res) => {
    try {
      const response = await api.post('/facebook/signin', { access_token: res.authResponse.accessToken });
      localStorage.setItem('user', JSON.stringify(response));
      dispatch(loginSuccess(response));
    } catch (error) {
      dispatch(signupFailure(getErrorMessage(error)));
    }
  }, { scope: 'public_profile,email' });
};

export const loginWithGoogle = (credential, success = true) => async (dispatch, getState, api) => {
  if (!success) {
    dispatch(signupFailure('Login failed'));
    return;
  }
  try {
    const response = await api.post('/google/signin', { access_token: credential });
    localStorage.setItem('user', JSON.stringify(response));
    dispatch(loginSuccess(response));
  } catch (error) {
    dispatch(signupFailure(getErrorMessage(error)));
  }
};

export const signup = (params) => async (dispatch, getState, api) => {
  try {
    const response = await api.post('/signup', params);

    localStorage.setItem('user', JSON.stringify(response));
    dispatch(signupSuccess(response));
  } catch (error) {
    dispatch(loginFailure(getErrorMessage(error)));
  }
};

export const register = (params) => async (dispatch, getState, api) => {
  try {
    const response = await api.put('/users', params);

    localStorage.setItem('user', JSON.stringify(response));
    dispatch(signupSuccess(response));
  } catch (error) {
    dispatch(signupFailure(getErrorMessage(error)));
  }
};

export const login = (credentials) => async (dispatch, getState, api) => {
  try {
    const response = await api.post('/login', credentials);

    localStorage.setItem('user', JSON.stringify(response));
    dispatch(signupSuccess(response));
  } catch (error) {
    dispatch(signupFailure(getErrorMessage(error)));
  }
};

export const logout = () => async (dispatch, getState, api) => {
  try {
    await api.post('/logout');

    localStorage.removeItem('user');
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFailure(error));
  }
};

export const requestPasswordChange = (email) => async (dispatch, getState, api) => {
  try {
    await api.post('/request_password_change', email);
    dispatch(requestPasswordChangeSuccess());
    setTimeout(() => {
      dispatch(clearUserNotification());
    }, 10000);
  } catch (error) {
    dispatch(requestPasswordChangeFailure(getErrorMessage(error)));
  }
};

export const resetPassword = (form) => async (dispatch, getState, api) => {
  try {
    const response = await api.post('/reset_password', form);

    dispatch(resetPasswordSuccess(response));
    setTimeout(() => {
      dispatch(clearUserNotification());
    }, 10000);
  } catch (error) {
    dispatch(resetPasswordFailure(getErrorMessage(error)));
  }
};
