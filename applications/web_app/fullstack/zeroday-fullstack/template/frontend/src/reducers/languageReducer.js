import * as types from '../actions/actionTypes';
import { DEFAULT_LANGUAGE } from '../translations/translations';

export default function languageReducer(state = DEFAULT_LANGUAGE, action) {
  switch (action.type) {
    case types.SET_LANGUAGE: {
      return {
        ...state,
        locale: action.payload.locale,
        name: action.payload.name,
      };
    }
    default: {
      return state;
    }
  }
}
