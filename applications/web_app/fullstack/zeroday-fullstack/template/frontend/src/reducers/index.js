import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import auth from './authReducer';
import users from './userReducer';
import messager from './messagerReducer';
import language from './languageReducer';
import * as types from '../actions/actionTypes';

const appReducer = combineReducers({
  auth,
  users,
  form: reduxFormReducer,
  messager,
  language,
});

const rootReducer = (state, action) => {
  let rootState = state;
  if (action.type === types.LOGOUT_SUCCESS) {
    rootState = undefined;
  }

  return appReducer(rootState, action);
};

export default rootReducer;
