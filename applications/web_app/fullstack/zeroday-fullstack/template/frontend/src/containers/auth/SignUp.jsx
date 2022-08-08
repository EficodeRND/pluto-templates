import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { propTypes, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as PropTypes from 'prop-types';

import AuthPage from '../../components/auth/AuthPage';
import * as authActions from '../../actions/auth';
import { userPropType } from '../../types/customPropTypes';

let SignUp = (props) => {
  const { from } = { from: { pathname: '/' } };
  const { user, signup, handleSubmit } = props;

  if (user) {
    return (<Redirect to={from} />);
  }

  return (
    <AuthPage
      signupPage
      submitAction={handleSubmit(signup)}
      {...props}
    />
  );
};

SignUp.propTypes = {
  ...propTypes,
  user: userPropType,
  signup: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
  user: null,
};

SignUp = reduxForm({
  form: 'signup',
})(SignUp);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  authError: state.auth.error,
});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
  loginWithFacebook: authActions.loginWithFacebook,
  loginWithGoogle: authActions.loginWithGoogle,
  signup: authActions.signup,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
