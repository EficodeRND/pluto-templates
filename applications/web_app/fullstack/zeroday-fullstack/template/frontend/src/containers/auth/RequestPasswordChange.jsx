import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { propTypes, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import * as PropTypes from 'prop-types';

import AuthPage from '../../components/auth/AuthPage';
import * as authActions from '../../actions/auth';
import { userPropType } from '../../types/customPropTypes';

let RequestPasswordChange = (props) => {
  const { from } = { from: { pathname: '/' } };
  const { user, requestPasswordChange, handleSubmit } = props;

  if (user) {
    return (<Redirect to={from} />);
  }

  return (
    <AuthPage
      requestPasswordChangePage
      submitAction={handleSubmit(requestPasswordChange)}
      {...props}
    />
  );
};

RequestPasswordChange.propTypes = {
  ...propTypes,
  user: userPropType,
  requestPasswordChange: PropTypes.func.isRequired,
};

RequestPasswordChange.defaultProps = {
  user: null,
};

RequestPasswordChange = reduxForm({
  form: 'requestPasswordChange',
})(RequestPasswordChange);

const mapStateToProps = (state) => ({
  message: state.auth.message,
  resetRequestSentFlag: state.auth.flags.resetRequestSentFlag,
});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
  loginWithFacebook: authActions.loginWithFacebook,
  loginWithGoogle: authActions.loginWithGoogle,
  requestPasswordChange: authActions.requestPasswordChange,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(RequestPasswordChange);
