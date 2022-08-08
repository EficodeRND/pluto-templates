import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { propTypes, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as PropTypes from 'prop-types';

import AuthPage from '../../components/auth/AuthPage';
import * as authActions from '../../actions/auth';
import { userPropType } from '../../types/customPropTypes';

let Login = (props) => {
  const { from } = { from: { pathname: '/' } };
  const { user, login, handleSubmit } = props;

  if (user) {
    return (<Redirect to={from} />);
  }

  return (
    <AuthPage
      loginPage
      submitAction={handleSubmit(login)}
      {...props}
    />
  );
};

Login.propTypes = {
  ...propTypes,
  user: userPropType,
  login: PropTypes.func.isRequired,
};

Login.defaultProps = {
  user: null,
};

Login = reduxForm({
  form: 'login',
})(Login);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  authError: state.auth.error,
});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
  login: authActions.login,
  loginWithFacebook: authActions.loginWithFacebook,
  loginWithGoogle: authActions.loginWithGoogle,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Login);
