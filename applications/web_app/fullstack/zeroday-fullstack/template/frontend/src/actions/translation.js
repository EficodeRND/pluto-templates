import * as types from './actionTypes';

export const setLanguage = (value) => ({ // eslint-disable-line import/prefer-default-export
  type: types.SET_LANGUAGE, payload: value,
});
