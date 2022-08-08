import * as types from '../actions/actionTypes';

export default function authReducer(state = {
  user: JSON.parse(localStorage.getItem('user')),
  redirectToReferrer: false,
  message: '',
  error: '',
  flags: {},
}, action) {
  switch (action.type) {
    case types.SIGNUP_SUCCESS: {
      return { ...state, user: action.payload, message: 'You have logged in successfully.' };
    }
    case types.SIGNUP_FAILURE: {
      return { ...state, error: types.SIGNUP_FAILURE };
    }
    case types.LOGIN_SUCCESS: {
      return { ...state, user: action.payload, error: '' };
    }
    case types.LOGIN_FAILURE: {
      return { ...state, user: null, error: types.LOGIN_FAILURE };
    }
    case types.LOGOUT_SUCCESS: {
      return { ...state, user: null };
    }
    case types.REQUEST_PASSWORD_CHANGE_SUCCESS: {
      return { ...state, flags: { ...state.flags, resetRequestSentFlag: true } };
    }
    case types.REQUEST_PASSWORD_CHANGE_FAILURE: {
      return {
        ...state,
        error: types.REQUEST_PASSWORD_CHANGE_FAILURE,
        flags: { ...state.flags, resetRequestSentFlag: false },
      };
    }
    case types.RESET_PASSWORD_SUCCESS: {
      return { ...state, flags: { ...state.flags, passwordChangedFlag: true } };
    }
    case types.RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        error: types.RESET_PASSWORD_FAILURE,
        flags: { ...state.flags, passwordChangedFlag: false },
      };
    }
    case types.CLEAR_AUTH_MESSAGE: {
      return {
        ...state, message: '', error: '', flags: { passwordChangedFlag: false, resetRequestSentFlag: false },
      };
    }
    default: {
      return state;
    }
  }
}
