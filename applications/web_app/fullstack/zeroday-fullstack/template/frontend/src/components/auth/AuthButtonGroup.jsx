import React from 'react';
import { Button } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import Translatable from '../translation/Translatable';

const AuthButtonGroup = ({
  history,
  loginPage,
  signupPage,
}) => (
  <Button.Group>
    <Button
      active={loginPage}
      onClick={() => { history.push('/login'); }}
    >
      <Translatable capitalize translationKey="login" />
    </Button>
    <Button
      active={signupPage}
      onClick={() => { history.push('/signup'); }}
    >
      <Translatable capitalize translationKey="signup" />
    </Button>
  </Button.Group>
);

AuthButtonGroup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loginPage: PropTypes.bool,
  signupPage: PropTypes.bool,
};

AuthButtonGroup.defaultProps = {
  loginPage: false,
  signupPage: false,
};

export default AuthButtonGroup;
