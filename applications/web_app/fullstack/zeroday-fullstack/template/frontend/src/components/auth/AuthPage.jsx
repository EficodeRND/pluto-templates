import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button, Divider, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { propTypes } from 'redux-form';
import { GoogleLogin } from '@react-oauth/google';

import ErrorMessage from './ErrorMessage';
import AuthButtonGroup from './AuthButtonGroup';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';
import RequestPasswordChangeForm from '../forms/RequestPasswordChangeForm';
import ResetPasswordForm from '../forms/ResetPasswordForm';
import Translatable from '../translation/Translatable';
import LanguageSwitcher from '../translation/LanguageSwitcher';

const AuthPage = (props) => {
  const {
    loginPage,
    signupPage,
    requestPasswordChangePage,
    resetPasswordPage,
    resetRequestSentFlag,
    passwordChangedFlag,
    history,
    submitAction,
    loginWithGoogle,
    loginWithFacebook,
    authError,
  } = props;
  return (
    <div className="login">
      <LanguageSwitcher />
      <Segment>
        { loginPage && <AuthButtonGroup loginPage history={history} /> }
        { signupPage && <AuthButtonGroup signupPage history={history} /> }
        { requestPasswordChangePage && <AuthButtonGroup history={history} /> }
        { resetPasswordPage && (
          <Header as="h3">
            <Translatable capitalize translationKey="change_password" />
          </Header>
        )}
        <Divider />
        { loginPage && <LoginForm onSubmit={submitAction} {...props} /> }
        { signupPage && <SignUpForm onSubmit={submitAction} {...props} /> }
        { requestPasswordChangePage
      && (
      <RequestPasswordChangeForm
        resetRequestSentFlag={resetRequestSentFlag}
        onSubmit={submitAction}
        {...props}
      />
      ) }
        { resetPasswordPage
        && <ResetPasswordForm passwordChangedFlag={passwordChangedFlag} onSubmit={submitAction} /> }
        { loginPage && (
          <Link to="/forgottenpassword">
            <Translatable capitalize translationKey="lost_password" />
          </Link>
        )}
        {!resetPasswordPage
          && (
            <div>
              <Divider />
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  loginWithGoogle(credentialResponse.credential);
                }}
                onError={() => {
                  loginWithGoogle(null, false);
                }}
              />
              <Button
                fluid
                color="facebook"
                className="oauth-login-btn"
                onClick={() => loginWithFacebook()}
              >
                <Icon name="facebook" />
                {' '}
                <Translatable capitalize translationKey="facebook_login" />
              </Button>
            </div>
          )}
      </Segment>

      <ErrorMessage message={authError} />
    </div>
  );
};

AuthPage.propTypes = {
  loginPage: PropTypes.bool,
  signupPage: PropTypes.bool,
  requestPasswordChangePage: PropTypes.bool,
  resetPasswordPage: PropTypes.bool,
  resetRequestSentFlag: PropTypes.bool,
  passwordChangedFlag: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  submitAction: PropTypes.func.isRequired,
  loginWithGoogle: PropTypes.func,
  loginWithFacebook: PropTypes.func,
  authError: PropTypes.string,
  ...propTypes,
};

AuthPage.defaultProps = {
  loginPage: false,
  signupPage: false,
  requestPasswordChangePage: false,
  resetPasswordPage: false,
  resetRequestSentFlag: false,
  passwordChangedFlag: false,
  loginWithGoogle: () => {},
  loginWithFacebook: () => {},
  authError: '',
};

export default AuthPage;
