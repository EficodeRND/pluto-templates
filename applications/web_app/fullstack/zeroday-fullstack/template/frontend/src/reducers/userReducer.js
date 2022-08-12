import * as types from '../actions/actionTypes';

export default function userReducer(state = {
  profile: {},
  error: '',
}, action) {
  switch (action.type) {
    case types.LOAD_USER_SUCCESS:
    case types.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
        error: '',
      };
    }
    case types.LOAD_USER_FAILURE:
    case types.UPDATE_USER_FAILURE: {
      return {
        ...state,
        profile: {},
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
