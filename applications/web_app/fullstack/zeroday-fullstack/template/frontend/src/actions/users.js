import * as types from './actionTypes';
import { getTranslation } from '../components/translation/Translatable';

const loadUserSuccess = (user) => ({ type: types.LOAD_USER_SUCCESS, payload: user });
const loadUserFailure = (error) => ({ type: types.LOAD_USER_FAILURE, payload: error });
const updateUserSuccess = (user) => ({ type: types.UPDATE_USER_SUCCESS, payload: user });
const updateUserFailure = (error) => ({ type: types.UPDATE_USER_FAILURE, payload: error });

const loadingUser = () => ({ type: types.USER_LOADING });

const getErrorMessage = (error) => getTranslation(
  error.response ? error.response.dataMessage : error.message,
);

export const getUser = (id) => async (dispatch, getState, api) => {
  try {
    dispatch(loadingUser());

    const response = await api.get(`/users/${id}`);

    dispatch(loadUserSuccess(response));
  } catch (error) {
    dispatch(loadUserFailure(getErrorMessage(error)));
  }
};

export const updateUser = (props) => async (dispatch, getState, api) => {
  try {
    const response = await api.put('/users', props);

    localStorage.setItem('user', JSON.stringify(response));

    dispatch(updateUserSuccess(response));
  } catch (error) {
    dispatch(updateUserFailure(getErrorMessage(error)));
  }
};
