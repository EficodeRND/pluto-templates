import * as types from './actionTypes';
import { environment } from '../utils/environmentUtils';

const googleLoginLoading = () => ({ type: types.GOOGLE_LOGIN_LOADING });
const googleLoginReady = () => ({ type: types.GOOGLE_LOGIN_READY });
const googleLoadFailure = (error) => ({ type: types.GOOGLE_LOGIN_FAILURE, payload: error });

const addGoogleApiToApp = (doc, tag, id) => (new Promise((resolve, reject) => {
  const fjs = doc.getElementsByTagName(tag)[0];
  if (doc.getElementById(id)) return;
  const js = doc.createElement(tag);

  js.id = id;
  js.src = '//apis.google.com/js/api.js';
  js.onload = () => resolve();
  js.onerror = () => reject(event); // eslint-disable-line

  fjs.parentNode.insertBefore(js, fjs);
}));

const loadOauth2 = () => (new Promise((resolve) => {
  window.gapi.load('auth2', () => resolve());
}));

const initOauth2Client = () => {
  if (environment.GOOGLE_OAUTH_ID) {
    window.gapi.auth2.init({
      client_id: environment.GOOGLE_OAUTH_ID,
    });
  } else {
    console.warn('No Google client id set!');
  }
};

const loadGoogle = () => async (dispatch) => {
  dispatch(googleLoginLoading());
  try {
    await addGoogleApiToApp(document, 'script', 'google-api');
    await loadOauth2();
    initOauth2Client();

    dispatch(googleLoginReady());
  } catch (error) {
    dispatch(googleLoadFailure(error));
  }
};

export default loadGoogle;
