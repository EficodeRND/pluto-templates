import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './containers/App';
import loadFacebook from './actions/facebook';
import configureStore from './store/configureStore';
import { environment } from './utils/environmentUtils';

import 'semantic-ui-css/semantic.css';
import './assets/stylesheets/main.less';

const store = configureStore();
store.dispatch(loadFacebook());

const app = document.getElementById('app');

const router = (
  <Provider store={store}>
    <GoogleOAuthProvider clientId={environment.GOOGLE_OAUTH_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>
);

ReactDOM.render(router, app);
