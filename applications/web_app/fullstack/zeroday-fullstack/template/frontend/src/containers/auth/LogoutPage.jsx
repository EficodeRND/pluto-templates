import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as PropTypes from 'prop-types';

import { logout } from '../../actions/auth';
import { userPropType } from '../../types/customPropTypes';

const LogoutPage = (props) => {
  const { user, location, dispatch } = props;

  useEffect(() => {
    dispatch(logout());
  });

  if (!user) {
    return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
  }

  return null;
};

LogoutPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: userPropType,
  location: PropTypes.string.isRequired,
};

LogoutPage.defaultProps = {
  user: null,
};

const mapStateToProps = (state) => ({ user: state.auth.user });

export default connect(mapStateToProps)(LogoutPage);
