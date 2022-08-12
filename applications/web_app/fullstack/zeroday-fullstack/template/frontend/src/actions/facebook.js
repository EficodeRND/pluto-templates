import * as types from './actionTypes';
import { environment } from '../utils/environmentUtils';

const facebookLoginLoading = () => ({ type: types.FACEBOOK_LOGIN_LOADING });
const facebookLoginReady = () => ({ type: types.FACEBOOK_LOGIN_READY });
const facebookLoadFailure = (error) => ({ type: types.FACEBOOK_LOGIN_FAILURE, payload: error });

window.fbAsyncInit = () => {};

const addFacebookSDK = (doc, id) => (new Promise((resolve, reject) => {
  const fjs = doc.getElementById('app');
  if (doc.getElementById(id)) return;
  const js = doc.createElement('script');

  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  js.onload = () => resolve();
  js.onerror = () => reject(event); // eslint-disable-line

  fjs.parentNode.insertBefore(js, fjs);
}));

const initFacebookApp = () => {
  window.FB.init({
    appId: environment.FACEBOOK_APP_ID || '1718775025100580',
    autoLogAppEvents: true,
    cookie: true,
    xfbml: true,
    version: 'v2.10',
  });
  window.FB.AppEvents.logPageView();
};

const loadFacebook = () => async (dispatch) => {
  dispatch(facebookLoginLoading());
  try {
    await addFacebookSDK(document, 'facebook-jssdk');

    initFacebookApp();
    dispatch(facebookLoginReady());
  } catch (error) {
    dispatch(facebookLoadFailure(error));
  }
};

export default loadFacebook;
