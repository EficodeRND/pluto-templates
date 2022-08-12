import React from 'react';
import { connect } from 'react-redux';
import { propTypes, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as PropTypes from 'prop-types';

import AuthPage from '../../components/auth/AuthPage';
import * as authActions from '../../actions/auth';

const ResetPassword = (props) => {
  const { resetPassword, handleSubmit } = props;

  return (
    <AuthPage
      resetPasswordPage
      submitAction={handleSubmit(resetPassword)}
      {...props}
    />
  );
};

ResetPassword.propTypes = {
  ...propTypes,
  resetPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  authError: state.auth.error,
  initialValues: { token: props.match.params.token },
  passwordChangedFlag: state.auth.flags.passwordChangedFlag,
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  loginWithFacebook: authActions.loginWithFacebook,
  loginWithGoogle: authActions.loginWithGoogle,
  resetPassword: authActions.resetPassword,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'resetpassword',
})(ResetPassword));
