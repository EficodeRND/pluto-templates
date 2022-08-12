import * as types from './actionTypes';

export const messagerSetValue = (value) => ({ // eslint-disable-line import/prefer-default-export
  type: types.MESSAGER_SET_VALUE, payload: value,
});
