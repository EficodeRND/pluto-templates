import * as types from '../actions/actionTypes';

export default function messagerReducer(state = {
  value: null,
}, action) {
  switch (action.type) {
    case types.MESSAGER_SET_VALUE: {
      return {
        ...state,
        value: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
