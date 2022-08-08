import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'semantic-ui-css/semantic.css';

import loadGoogle from './actions/google';
import loadFacebook from './actions/facebook';

import configureStore from './store/configureStore';

import App from './containers/App';

import './assets/stylesheets/main.less';

const store = configureStore();
store.dispatch(loadGoogle());
store.dispatch(loadFacebook());

const app = document.getElementById('app');

const router = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(router, app);
